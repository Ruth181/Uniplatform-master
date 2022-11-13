import { ArticleTag } from '@entities/article-tag.entity';
import {
  BadRequestException,
  HttpStatus,
  Injectable,
  NotFoundException,
  NotImplementedException,
} from '@nestjs/common';
import { GenericService } from '@schematics/services/generic.service';
import { BaseResponseTypeDTO } from '@utils/types/utils.types';
import {
  ArticleTagResponseDTO,
  CreateArticleTagDTO,
  UpdateArticleTagDTO,
} from './dto/article-tag.dto';

@Injectable()
export class ArticleTagService extends GenericService(ArticleTag) {
  //get all
  //post new tag
  //delete tag
  //get tag by id

  async findAllTags(): Promise<ArticleTagResponseDTO> {
    try {
      const data: ArticleTag[] = await this.findAll();
      return {
        code: HttpStatus.FOUND,
        data,
        message: 'REQUEST SUCCESSFUL',
        success: true,
      };
    } catch (ex) {
      throw ex;
    }
  }

  async findTagById(id: string): Promise<ArticleTagResponseDTO> {
    try {
      const data: ArticleTag = await this.getRepo().findOne({ where: { id } });
      if (!data) {
        throw new NotFoundException('INVALID ID');
      }
      return {
        code: HttpStatus.FOUND,
        data,
        message: 'REQUEST SUCCESSFUL',
        success: true,
      };
    } catch (ex) {
      throw ex;
    }
  }

  async updateArticleTag(
    payload: UpdateArticleTagDTO,
  ): Promise<BaseResponseTypeDTO> {
    try {
      const { id } = payload;
      const tag = await this.getRepo().findOne({ where: { id } });

      if (!tag) {
        throw new NotFoundException('INVALID ID');
      }
      if ('status' in payload) {
        tag.status = payload.status;
      }

      const updatedTag: Partial<ArticleTag> = {
        status: tag.status,
      };

      await this.getRepo().update({ id }, updatedTag);
      return {
        code: HttpStatus.OK,
        message: 'UPDATE SUCCESSFUL',
        success: true,
      };
    } catch (ex) {
      throw ex;
    }
  }

  async createArticleTag(
    payload: CreateArticleTagDTO,
  ): Promise<ArticleTagResponseDTO> {
    try {
      const { articleId, interestId } = payload;
      if (!articleId || !interestId) {
        throw new BadRequestException(
          "Fields 'articleId', 'interestId' are required",
        );
      }
      const newArticleTag: ArticleTag = await this.getRepo().save({
        ...payload,
      });
      if (!newArticleTag) {
        throw new NotImplementedException('TAG WAS NOT CREATED');
      }
      return {
        code: HttpStatus.CREATED,
        message: 'TAG CREATED',
        data: newArticleTag,
        success: true,
      };
    } catch (ex) {
      throw ex;
    }
  }
}
