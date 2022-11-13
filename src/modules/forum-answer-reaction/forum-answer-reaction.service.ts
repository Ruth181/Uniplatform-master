import { ConflictException, HttpStatus, Injectable } from '@nestjs/common';
import { GenericService } from '@schematics/services/generic.service';
import { ForumAnswerReaction } from '@entities/forum-answer-reaction.entity';
import { ForumAnswerService } from '@modules/forum-answer/forum-answer.service';

import {
  checkForRequiredFields,
  compareEnumValueFields,
} from '@utils/functions/utils.function';
import { ForumReactionType } from '@utils/types/utils.constant';
import {
  CreateForumAnswerReactionDTO,
  ForumAnswerReactionResponseDTO,
  ForumAnswerReactionsResponseDTO,
} from './dto/forum-answer-reaction.dto';

@Injectable()
export class ForumAnswerReactionService extends GenericService(
  ForumAnswerReaction,
) {
  constructor(private readonly forumAnswerSrv: ForumAnswerService) {
    super();
  }

  async reactToForumAnswerPost(
    payload: CreateForumAnswerReactionDTO,
    userId: string,
  ): Promise<ForumAnswerReactionResponseDTO> {
    try {
      checkForRequiredFields(['forumAnswerId', 'type'], payload);
      compareEnumValueFields(
        payload.type,
        Object.values(ForumReactionType),
        'type',
      );
      const recordFound = await this.getRepo().findOne({
        where: {
          userId,
          forumAnswerId: payload.forumAnswerId,
          type: payload.type,
        },
      });
      if (recordFound?.id) {
        if (
          payload.type === ForumReactionType.LIKE ||
          payload.type === ForumReactionType.DISLIKE
        ) {
          return {
            success: true,
            code: HttpStatus.CREATED,
            data: recordFound,
            message: 'Created',
          };
        } else {
          throw new ConflictException(
            `User has already ${payload.type} this answer`,
          );
        }
      }
      await this.toggleReactionChecksLikeDislike(payload, userId);
      await this.toggleReactionChecksRelevance(payload, userId);
      const createdReaction = await this.create<Partial<ForumAnswerReaction>>({
        ...payload,
        userId,
      });
      if (createdReaction.type === ForumReactionType.RELEVANT) {
        await this.checkForBestAnswer(createdReaction.forumAnswerId);
      }
      return {
        success: true,
        code: HttpStatus.CREATED,
        data: createdReaction,
        message: 'Created',
      };
    } catch (ex) {
      this.logger.error(ex);
      throw ex;
    }
  }

  async findForumAnswerReactions(
    payload: CreateForumAnswerReactionDTO,
  ): Promise<ForumAnswerReactionsResponseDTO> {
    try {
      checkForRequiredFields(['forumAnswerId', 'type'], payload);
      compareEnumValueFields(
        payload.type,
        Object.values(ForumReactionType),
        'type',
      );
      const { forumAnswerId, type } = payload;
      const records = await this.getRepo().find({
        where: { forumAnswerId, type },
        relations: ['forumAnswer', 'user'],
      });
      return {
        success: true,
        code: HttpStatus.OK,
        data: records,
        message: 'Records found',
      };
    } catch (ex) {
      this.logger.error(ex);
      throw ex;
    }
  }

  private async checkForBestAnswer(forumAnswerId: string): Promise<void> {
    try {
      const answer = await this.forumAnswerSrv.getRepo().findOne({
        where: { id: forumAnswerId },
        relations: [
          'forum',
          'forum.answersForThisForum',
          'forum.answersForThisForum.reactionsForThisForumAnswer',
        ],
      });
      if (answer?.id) {
        const forum = answer.forum;
        let aggregate = [];
        for (const item of forum.answersForThisForum) {
          const numberOfReactions = await this.getRepo().count({
            where: {
              forumAnswerId: item.id,
              type: ForumReactionType.RELEVANT,
            },
          });
          aggregate.push({ numberOfReactions, answer: item });
        }
        // Sort by highest to lowest numberOfReactions
        aggregate = aggregate.sort((a, b) =>
          a.numberOfReactions > b.numberOfReactions ? -1 : 1,
        );
        if (aggregate && aggregate[0]) {
          await this.forumAnswerSrv
            .getRepo()
            .update({ id: aggregate[0].answer.id }, { isBestAnswer: true });
        }
      }
    } catch (ex) {
      this.logger.error(ex);
      throw ex;
    }
  }

  private async toggleReactionChecksLikeDislike(
    payload: CreateForumAnswerReactionDTO,
    userId,
  ): Promise<void> {
    if (payload.type === ForumReactionType.DISLIKE) {
      const record = await this.findOne({
        userId,
        type: ForumReactionType.LIKE,
        forumAnswerId: payload.forumAnswerId,
      });
      if (record?.id) {
        await this.delete({ id: record.id });
      }
    }
    if (payload.type === ForumReactionType.LIKE) {
      const record = await this.findOne({
        userId,
        type: ForumReactionType.DISLIKE,
        forumAnswerId: payload.forumAnswerId,
      });
      if (record?.id) {
        await this.delete({ id: record.id });
      }
    }
  }

  private async toggleReactionChecksRelevance(
    payload: CreateForumAnswerReactionDTO,
    userId,
  ): Promise<void> {
    if (payload.type === ForumReactionType.RELEVANT) {
      const record = await this.findOne({
        userId,
        type: ForumReactionType.NOT_RELEVANT,
        forumAnswerId: payload.forumAnswerId,
      });
      if (record?.id) {
        await this.delete({ id: record.id });
      }
    }
    if (payload.type === ForumReactionType.NOT_RELEVANT) {
      const record = await this.findOne({
        userId,
        type: ForumReactionType.RELEVANT,
        forumAnswerId: payload.forumAnswerId,
      });
      if (record?.id) {
        await this.delete({ id: record.id });
      }
    }
  }
}
