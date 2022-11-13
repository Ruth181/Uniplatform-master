import { ArticleCommentReply } from '@entities/article-comment-reply.entity';
import { UserService } from '@modules/user/user.service';
import {
  BadRequestException,
  HttpStatus,
  Injectable,
  NotImplementedException,
} from '@nestjs/common';
import { GenericService } from '@schematics/services/generic.service';
import { checkForRequiredFields } from '@utils/functions/utils.function';
import {
  ArticleCommentRepliesResponse,
  ArticleCommentReplyResponse,
  CreateArticleCommentReplyDTO,
} from './dto/article-comment-reply.dto';

@Injectable()
export class ArticleCommentReplyService extends GenericService(
  ArticleCommentReply,
) {
  async createCommentReply(
    payload: CreateArticleCommentReplyDTO,
    userId: string,
  ): Promise<ArticleCommentReplyResponse> {
    try {
      const { articleCommentId, text } = payload;
      checkForRequiredFields(['articleCommentId', 'text'], payload);

      const ifUserExists = await this.getRepo().findOne({
        where: { userId, articleCommentId, text },
        select: ['id'],
      });
      if (ifUserExists?.id) {
        throw new BadRequestException('Similar REPLY has already been made');
      }
      const data = await this.create<Partial<ArticleCommentReply>>({
        articleCommentId,
        text,
        userId,
      });
      if (!data) {
        throw new NotImplementedException('REPLY TO COMMENT WAS NOT SAVED');
      }
      return {
        code: HttpStatus.CREATED,
        data,
        message: 'REPLY SAVED',
        success: true,
      };
    } catch (ex) {
      throw ex;
    }
  }

  async replyBasedOnComment(
    articleCommentId: string,
  ): Promise<ArticleCommentRepliesResponse> {
    try {
      const articleComments: ArticleCommentReply[] = await this.getRepo().find({
        where: { articleCommentId },
      });
      return {
        code: HttpStatus.OK,
        message: 'REQUEST SUCCESSFUL',
        data: articleComments,
        success: true,
      };
    } catch (ex) {
      throw ex;
    }
  }
}
