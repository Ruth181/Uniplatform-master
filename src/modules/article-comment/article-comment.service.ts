import { ArticleComment } from '@entities/article-comment.entity';
import { UserService } from '@modules/user/user.service';
import {
  BadRequestException,
  HttpStatus,
  Injectable,
  NotFoundException,
  NotImplementedException,
} from '@nestjs/common';
import { GenericService } from '@schematics/services/generic.service';
import { checkForRequiredFields } from '@utils/functions/utils.function';
import {
  ArticleCommentResponseDTO,
  ArticleCommentsResponseDTO,
  CreateArticleCommentDTO,
} from './dto/article-comment.dto';

@Injectable()
export class ArticleCommentService extends GenericService(ArticleComment) {
  constructor(private readonly userService: UserService) {
    super();
  }

  async createComment(
    payload: CreateArticleCommentDTO,
    userId: string,
  ): Promise<ArticleCommentResponseDTO> {
    // Check if user has already made comment for article and check if the comment is the same
    try {
      const { articleId, text } = payload;

      checkForRequiredFields(['articleId', 'text'], payload);
      const recordExists = await this.getRepo().findOne({
        where: { userId, articleId, text },
        select: ['id'],
      });
      if (recordExists?.id) {
        throw new BadRequestException('Similar Comment has already been made');
      }
      const data = await this.create<Partial<ArticleComment>>({
        articleId,
        text,
        userId,
      });
      if (!data) {
        throw new NotImplementedException('COMMENT ON ARTICLE WAS NOT SAVED');
      }
      return {
        code: HttpStatus.CREATED,
        data,
        message: 'COMMENT SAVED',
        success: true,
      };
    } catch (ex) {
      throw ex;
    }
  }

  async findCommentsUnderArticle(
    articleId: string,
  ): Promise<ArticleCommentsResponseDTO> {
    try {
      const articleComments: ArticleComment[] = await this.getRepo().find({
        where: { articleId },
      });

      return {
        code: HttpStatus.FOUND,
        message: 'REQUEST SUCCESSFUL',
        data: articleComments,
        success: true,
      };
    } catch (ex) {
      throw ex;
    }
  }

  async findCommentById(id: string): Promise<ArticleCommentResponseDTO> {
    try {
      const data = await this.getRepo().findOne({ where: { id } });
      if (!data) {
        throw new NotFoundException('COMMENT NOT FOUND');
      }
      return {
        code: HttpStatus.FOUND,
        message: 'COMMENT FOUND',
        data,
        success: true,
      };
    } catch (ex) {
      throw ex;
    }
  }
}
