import { ConflictException, HttpStatus, Injectable } from '@nestjs/common';
import { GenericService } from '@schematics/services/generic.service';
import {
  checkForRequiredFields,
  compareEnumValueFields,
} from '@utils/functions/utils.function';
import { ForumReaction } from '@entities/forum-reaction.entity';
import { ForumReactionType } from '@utils/types/utils.constant';
import {
  CreateForumReactionDTO,
  ForumReactionResponseDTO,
  ForumReactionsResponseDTO,
} from './dto/forum-reaction.dto';

@Injectable()
export class ForumReactionService extends GenericService(ForumReaction) {
  async reactToForumPost(
    payload: CreateForumReactionDTO,
    userId: string,
  ): Promise<ForumReactionResponseDTO> {
    try {
      checkForRequiredFields(['forumId', 'type'], payload);
      compareEnumValueFields(
        payload.type,
        Object.values(ForumReactionType),
        'type',
      );
      const recordFound = await this.getRepo().findOne({
        where: { userId, forumId: payload.forumId, type: payload.type },
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
          //   await this.delete({ id: recordFound.id });
        } else {
          throw new ConflictException(
            `User has already ${payload.type} this post`,
          );
        }
      }
      await this.toggleReactionChecksLikeDislike(payload, userId);
      await this.toggleReactionChecksRelevance(payload, userId);
      const createdReaction = await this.create<Partial<ForumReaction>>({
        ...payload,
        userId,
      });
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

  async findForumReactions(
    payload: CreateForumReactionDTO,
  ): Promise<ForumReactionsResponseDTO> {
    try {
      checkForRequiredFields(['forumId', 'type'], payload);
      compareEnumValueFields(
        payload.type,
        Object.values(ForumReactionType),
        'type',
      );
      const { forumId, type } = payload;
      const records = await this.getRepo().find({
        where: { forumId, type },
        relations: ['forum', 'user'],
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

  private async toggleReactionChecksLikeDislike(
    payload: CreateForumReactionDTO,
    userId,
  ): Promise<void> {
    if (payload.type === ForumReactionType.DISLIKE) {
      const record = await this.findOne({
        userId,
        type: ForumReactionType.LIKE,
        forumId: payload.forumId,
      });
      if (record?.id) {
        await this.delete({ id: record.id });
      }
    }
    if (payload.type === ForumReactionType.LIKE) {
      const record = await this.findOne({
        userId,
        type: ForumReactionType.DISLIKE,
        forumId: payload.forumId,
      });
      if (record?.id) {
        await this.delete({ id: record.id });
      }
    }
  }

  private async toggleReactionChecksRelevance(
    payload: CreateForumReactionDTO,
    userId,
  ): Promise<void> {
    if (payload.type === ForumReactionType.RELEVANT) {
      const record = await this.findOne({
        userId,
        type: ForumReactionType.NOT_RELEVANT,
        forumId: payload.forumId,
      });
      if (record?.id) {
        await this.delete({ id: record.id });
      }
    }
    if (payload.type === ForumReactionType.NOT_RELEVANT) {
      const record = await this.findOne({
        userId,
        type: ForumReactionType.RELEVANT,
        forumId: payload.forumId,
      });
      if (record?.id) {
        await this.delete({ id: record.id });
      }
    }
  }
}
