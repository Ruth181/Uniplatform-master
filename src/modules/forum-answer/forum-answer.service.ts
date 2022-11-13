import { ConflictException, HttpStatus, Injectable } from '@nestjs/common';
import { GenericService } from '@schematics/services/generic.service';
import {
  checkForRequiredFields,
  validateUUIDField,
} from '@utils/functions/utils.function';
import { ForumAnswer } from '@entities/forum-answer.entity';
import {
  CreateForumAnswerDTO,
  ForumAnswerResponseDTO,
  ForumAnswersResponseDTO,
} from './dto/forum-answer.dto';

@Injectable()
export class ForumAnswerService extends GenericService(ForumAnswer) {
  async answerForumQuestion(
    payload: CreateForumAnswerDTO,
    userId: string,
  ): Promise<ForumAnswerResponseDTO> {
    try {
      checkForRequiredFields(['text', 'forumId'], payload);
      validateUUIDField(userId, 'userId');
      const record = await this.findOne({ ...payload, userId });
      if (record?.id) {
        throw new ConflictException('Similar comment exists');
      }
      const createdAnswer = await this.create<Partial<ForumAnswer>>({
        ...payload,
        userId,
      });
      return {
        success: true,
        code: HttpStatus.CREATED,
        data: createdAnswer,
        message: 'Record found',
      };
    } catch (ex) {
      this.logger.error(ex);
      throw ex;
    }
  }

  async findForumAnswerByForumId(
    forumId: string,
  ): Promise<ForumAnswersResponseDTO> {
    try {
      if (!forumId) {
        throw new ConflictException('Field forumId is required');
      }
      const records = await this.getRepo().find({
        where: { forumId },
        relations: ['user', 'forum', 'forum.answersForThisForum'],
      });
      return {
        success: true,
        code: HttpStatus.OK,
        data: records,
        message: 'Record found',
      };
    } catch (ex) {
      this.logger.error(ex);
      throw ex;
    }
  }
}
