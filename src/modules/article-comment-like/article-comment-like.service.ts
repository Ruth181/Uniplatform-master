import { ArticleCommentLike } from '@entities/article-comment-like.entity';
import { HttpStatus, Injectable } from '@nestjs/common';
import { GenericService } from '@schematics/services/generic.service';
import { checkForRequiredFields } from '@utils/functions/utils.function';
import { BaseResponseTypeDTO } from '@utils/types/utils.types';
import { ArticleCommentLikeDTO } from './dto/article-comment-like.dto';

@Injectable()
export class ArticleCommentLikeService extends GenericService(
  ArticleCommentLike,
) {
  async createLikeRequest(
    payload: ArticleCommentLikeDTO,
    userId: string,
  ): Promise<BaseResponseTypeDTO> {
    try {
      checkForRequiredFields(['articleCommentId'], payload);
      const { articleCommentId } = payload;
      const recordExists = await this.getRepo().findOne({
        where: { userId, articleCommentId },
      });
      if (recordExists) {
        await this.delete({ id: recordExists.id });
      } else {
        await this.create<Partial<ArticleCommentLike>>({
          articleCommentId,
          userId,
        });
      }
      return {
        success: true,
        code: HttpStatus.CREATED,
        message: 'Liked',
      };
    } catch (ex) {
      throw ex;
    }
  }
}
