import { ArticleReaction } from '@entities/article-reaction.entity';
import { ArticleTag } from '@entities/article-tag.entity';
import { Article } from '@entities/article.entity';
import { ArticleReactionService } from '@modules/article-reaction/article-reaction.service';
import { CreateArticleReactionDTO } from '@modules/article-reaction/dto/article-reaction.dto';
import { ArticleTagService } from '@modules/article-tag/article-tag.service';
import { UserInterestService } from '@modules/user-interest/user-interest.service';
import { UsersResponseDTO } from '@modules/user/dto/user.dto';
import {
  Injectable,
  BadRequestException,
  ConflictException,
  HttpStatus,
  NotFoundException,
  NotImplementedException,
} from '@nestjs/common';
import { GenericService } from '@schematics/services/generic.service';
import {
  calculatePaginationControls,
  checkForRequiredFields,
  compareEnumValueFields,
} from '@utils/functions/utils.function';
import { ArticleType, ReactionType } from '@utils/types/utils.constant';
import {
  BaseResponseTypeDTO,
  PaginationRequestType,
} from '@utils/types/utils.types';
import { FindManyOptions } from 'typeorm';
import {
  ArticleResponseDTO,
  ArticlesResponseDTO,
  CreateArticleDTO,
  PublishArticleDTO,
  UpdateArticleDTO,
} from './dto/article.dto';

@Injectable()
export class ArticleService extends GenericService(Article) {
  private relations = [
    'reactionsForThisArticle',
    'commentsForThisArticle',
    'tagsForThisArticle',
    'tagsForThisArticle.interest',
    'user',
    'user.userProfiles',
    'user.userProfiles.institution',
    'user.userProfiles.department',
    'tagsForThisArticle',
    'commentsForThisArticle',
    'commentsForThisArticle.user',
    'commentsForThisArticle.user.userProfiles',
  ];

  constructor(
    private readonly articleTagSrv: ArticleTagService,
    private readonly articleReactionSrv: ArticleReactionService,
    private userInterestSrv: UserInterestService,
  ) {
    super();
  }

  async createArticle(
    payload: CreateArticleDTO,
    userId: string,
  ): Promise<ArticleResponseDTO> {
    try {
      checkForRequiredFields(['title', 'body'], payload);
      const data = await this.create<Partial<Article>>({
        ...payload,
        userId,
      });
      if (!data) {
        throw new NotImplementedException('ARTICLE WAS NOT SAVED');
      }
      return {
        code: HttpStatus.CREATED,
        data,
        message: 'Created',
        success: true,
      };
    } catch (ex) {
      throw ex;
    }
  }

  //update
  async updateArticle(payload: UpdateArticleDTO): Promise<BaseResponseTypeDTO> {
    try {
      const { articleId, title, body, coverPhoto } = payload;
      const article: Article = await this.getRepo().findOne({
        where: { id: articleId },
      });
      if (article) {
        if (title && article.title !== title) {
          article.title = title;
        }
        if (body && article.body !== body) {
          article.body = body;
        }
        if (coverPhoto && article.coverPhoto !== coverPhoto) {
          article.coverPhoto = coverPhoto;
        }
        if ('status' in payload) {
          article.status = payload.status;
        }
        const updatedArticle: Partial<Article> = {
          title: article.title,
          body: article.body,
          coverPhoto: article.coverPhoto,
          status: article.status,
        };
        await this.getRepo().update({ id: article.id }, updatedArticle);
        return {
          code: HttpStatus.OK,
          success: true,
          message: 'UPDATE COMPLETE',
        };
      } else throw new NotFoundException('ARTICLE NOT FOUND');
    } catch (ex) {
      throw ex;
    }
  }

  async findAllArticles(
    payload?: PaginationRequestType,
  ): Promise<ArticlesResponseDTO> {
    try {
      if (payload?.pageNumber) {
        payload = {
          pageSize: parseInt(`${payload.pageSize}`),
          pageNumber: parseInt(`${payload.pageNumber}`),
        };
        const options: FindManyOptions = {
          order: { dateCreated: 'DESC' },
          take: payload.pageSize,
          skip: (payload.pageNumber - 1) * payload.pageSize,
          relations: this.relations,
        };
        const { response, paginationControl } =
          await calculatePaginationControls<Article>(
            this.getRepo(),
            options,
            payload,
          );
        return {
          success: true,
          message: 'REQUEST SUCCESSFUL',
          code: HttpStatus.OK,
          data: response,
          paginationControl: paginationControl,
        };
      } else {
        const data = await this.getRepo().find({
          order: { dateCreated: 'DESC' },
          relations: this.relations,
        });
        return {
          code: HttpStatus.FOUND,
          data,
          message: 'REQUEST SUCCESSFUL',
          success: true,
        };
      }
    } catch (ex) {
      throw ex;
    }
  }

  async findAllByStatus(
    status: boolean,
    payload?: PaginationRequestType,
  ): Promise<ArticlesResponseDTO> {
    try {
      if (payload?.pageNumber) {
        payload = {
          pageNumber: parseInt(`${payload.pageNumber}`),
          pageSize: parseInt(`${payload.pageSize}`),
        };

        const options: FindManyOptions = {
          take: payload.pageSize,
          skip: (payload.pageNumber - 1) * payload.pageSize,
          where: { status },
          relations: this.relations,
          order: { dateCreated: 'DESC' },
        };
        const { response, paginationControl } =
          await calculatePaginationControls<Article>(
            this.getRepo(),
            options,
            payload,
          );
        return {
          success: true,
          message: 'REQUEST SUCCESSFUL',
          code: HttpStatus.OK,
          data: response,
          paginationControl: paginationControl,
        };
      } else {
        const articles = await this.getRepo().find({
          where: { status },
          order: { dateCreated: 'DESC' },
          relations: this.relations,
        });
        return {
          code: HttpStatus.OK,
          data: articles,
          message: 'REQUEST SUCCESSFUL',
          success: true,
        };
      }
    } catch (ex) {
      throw ex;
    }
  }

  //get by id
  async findById(articleId: string): Promise<ArticleResponseDTO> {
    try {
      const article: Article = await this.getRepo().findOne({
        where: { id: articleId },
        relations: this.relations,
      });
      if (!article) {
        throw new NotFoundException('ARTICLE NOT FOUND');
      }
      return {
        code: HttpStatus.OK,
        data: article,
        message: 'REQUEST SUCCESSFUL',
        success: true,
      };
    } catch (ex) {
      throw ex;
    }
  }

  //delete by id
  async deleteArticle(id: string): Promise<BaseResponseTypeDTO> {
    try {
      const isDeleted = await this.getRepo().delete(id);

      if (isDeleted)
        return {
          code: HttpStatus.OK,
          message: 'ARTICLE DELETED',
          success: true,
        };
    } catch (ex) {
      throw ex;
    }
  }

  // publish an article
  async publishArticle(
    payload: PublishArticleDTO,
  ): Promise<ArticleResponseDTO> {
    try {
      const { coverPhoto, interestIds, articleId } = payload;
      checkForRequiredFields(
        ['coverPhoto', 'articleId', 'interestIds'],
        payload,
      );
      let recordFound = await this.findOne({ id: articleId });
      if (!recordFound?.id) {
        throw new NotFoundException('Article not found');
      }
      if (recordFound.type === ArticleType.PUBLISHED) {
        throw new ConflictException('Article is already published');
      }
      await this.getRepo().update(
        { id: recordFound.id },
        { coverPhoto, type: ArticleType.PUBLISHED },
      );
      await this.articleTagSrv.createMany<Partial<ArticleTag>>(
        interestIds.map((interestId) => ({
          articleId: recordFound.id,
          interestId,
        })),
      );
      recordFound = await this.getRepo().findOne({
        where: { id: articleId },
        relations: ['tagsForThisArticle'],
      });
      return {
        success: true,
        code: HttpStatus.OK,
        data: recordFound,
        message: 'Article Published',
      };
    } catch (ex) {
      this.logger.error(ex);
      throw ex;
    }
  }

  async reactToArticle(
    payload: CreateArticleReactionDTO,
    reaction: ReactionType = ReactionType.LIKE,
  ): Promise<BaseResponseTypeDTO> {
    try {
      checkForRequiredFields(['userId', 'articleId'], payload);
      const recordExists = await this.getRepo().findOne({
        where: { id: payload.articleId },
        relations: ['reactionsForThisArticle', 'user'],
      });
      if (!recordExists?.id) {
        throw new NotFoundException('Article not found');
      }
      const reactionFound = await this.articleReactionSrv.findOne({
        userId: payload.userId,
        articleId: payload.articleId,
        purpose: reaction,
      });
      if (reactionFound?.id) {
        if (reactionFound.purpose === ReactionType.LIKE) {
          await this.articleReactionSrv.delete({
            id: reactionFound.id,
            userId: payload.userId,
          });
        } else {
          throw new ConflictException(
            `User has already ${reaction} this article`,
          );
        }
      }
      await this.articleReactionSrv.create<Partial<ArticleReaction>>({
        articleId: recordExists.id,
        purpose: reaction,
        userId: payload.userId,
      });
      return {
        success: true,
        message: `Article ${reaction} successful`,
        code: HttpStatus.OK,
      };
    } catch (ex) {
      this.logger.error(ex);
      throw ex;
    }
  }

  async findUsersWhoReactedToAnArticle(
    articleId: string,
    reaction: ReactionType = ReactionType.LIKE,
  ): Promise<UsersResponseDTO> {
    try {
      compareEnumValueFields(reaction, Object.values(ReactionType), 'reaction');
      const recordExists = await this.getRepo().findOne({
        where: { id: articleId },
        relations: ['user'],
      });
      if (!recordExists?.id) {
        throw new NotFoundException('Article not found');
      }
      const reactionRecords = await this.articleReactionSrv.getRepo().find({
        where: { purpose: reaction, articleId },
        relations: ['user'],
      });
      return {
        success: true,
        message: `${reactionRecords.length} User(s) found`,
        code: HttpStatus.OK,
        data: reactionRecords.map(({ user }) => user),
      };
    } catch (ex) {
      this.logger.error(ex);
      throw ex;
    }
  }

  async findArticlesByInterest(
    interestId: string,
    payload?: PaginationRequestType,
  ): Promise<ArticlesResponseDTO> {
    try {
      if (!interestId) {
        throw new BadRequestException('Field interestId is required');
      }
      if (payload?.pageNumber) {
        payload = {
          pageSize: parseInt(`${payload.pageSize}`),
          pageNumber: parseInt(`${payload.pageNumber}`),
        };

        const options: FindManyOptions = {
          take: payload.pageSize,
          skip: (payload.pageNumber - 1) * payload.pageSize,
          where: { interestId },
          relations: ['article'],
        };
        const { response, paginationControl } =
          await calculatePaginationControls<ArticleTag>(
            this.articleTagSrv.getRepo(),
            options,
            payload,
          );

        const articles: Article[] = [];
        const mappedArticles = response.map(({ article }) => article);
        for (const item of mappedArticles) {
          if (!articles.find((i) => i.id === item.id)) {
            articles.push(item);
          }
        }

        return {
          success: true,
          message: 'REQUEST SUCCESSFUL',
          code: HttpStatus.OK,
          data: articles,
          paginationControl: paginationControl,
        };
      } else {
        const articleTagsFound = await this.articleTagSrv.getRepo().find({
          where: { interestId },
          relations: ['article'],
        });
        const articles: Article[] = [];
        const mappedArticles = articleTagsFound.map(({ article }) => article);
        for (const item of mappedArticles) {
          if (!articles.find((i) => i.id === item.id)) {
            articles.push(item);
          }
        }
        return {
          success: true,
          code: HttpStatus.OK,
          data: articles,
          message: `${articles.length} Article(s) found`,
        };
      }
    } catch (ex) {
      this.logger.error(ex);
      throw ex;
    }
  }

  async findAllArticlesForUser(
    userId: string,
    payload?: PaginationRequestType,
  ): Promise<ArticlesResponseDTO> {
    try {
      if (!userId) {
        throw new BadRequestException('Field userId is required');
      }
      const articles: Article[] = [];

      const users = await this.userInterestSrv.findAllByCondition({ userId });
      if (users?.length > 0) {
        if (payload?.pageNumber) {
          payload = {
            pageSize: parseInt(`${payload.pageSize}`),
            pageNumber: parseInt(`${payload.pageNumber}`),
          };

          const options: FindManyOptions = {
            take: payload.pageSize,
            skip: (payload.pageNumber - 1) * payload.pageSize,
            where: { userId },
            relations: ['article'],
          };

          const { response, paginationControl } =
            await calculatePaginationControls<ArticleTag>(
              this.articleTagSrv.getRepo(),
              options,
              payload,
            );

          return {
            success: true,
            message: 'REQUEST SUCCESSFUL',
            code: HttpStatus.OK,
            data: response.map((articleTag) => articleTag.article),
            paginationControl: paginationControl,
          };
        } else {
          for (const { interestId } of users) {
            const articleFound = await this.articleTagSrv.getRepo().findOne({
              where: { interestId },
              relations: ['article'],
            });
            if (
              articleFound?.id &&
              !articles.find((item) => item.id === articleFound.articleId)
            ) {
              articles.push(articleFound.article);
            }
          }
          return {
            success: true,
            code: HttpStatus.OK,
            data: articles,
            message: `${articles.length} Article(s) found`,
          };
        }
      } else {
        throw new NotFoundException('Interests were not set for this user');
      }
    } catch (ex) {
      this.logger.error(ex);
      throw ex;
    }
  }

  async findSavedArticles(
    userId: string,
    payload?: PaginationRequestType,
  ): Promise<ArticlesResponseDTO> {
    try {
      if (!userId) {
        throw new BadRequestException('Field userId is required');
      }
      const articles: Article[] = [];

      if (payload?.pageNumber) {
        payload = {
          pageNumber: parseInt(`${payload.pageNumber}`),
          pageSize: parseInt(`${payload.pageSize}`),
        };

        const options: FindManyOptions = {
          take: payload.pageSize,
          skip: (payload.pageNumber - 1) * payload.pageSize,
          where: { userId, purpose: ReactionType.BOOKMARK },
          relations: ['article'],
        };

        const { response, paginationControl } =
          await calculatePaginationControls<ArticleReaction>(
            this.articleReactionSrv.getRepo(),
            options,
            payload,
          );

        articles.push(...response.map(({ article }) => article));

        return {
          success: true,
          message: 'REQUEST SUCCESSFUL',
          code: HttpStatus.OK,
          data: articles,
          paginationControl: paginationControl,
        };
      } else {
        const reactions = await this.articleReactionSrv.getRepo().find({
          where: { userId, purpose: ReactionType.BOOKMARK },
          relations: ['article'],
        });

        articles.push(...reactions.map(({ article }) => article));
        return {
          success: true,
          code: HttpStatus.OK,
          data: articles,
          message: `${articles.length} Article(s) found`,
        };
      }
    } catch (ex) {
      this.logger.error(ex);
      throw ex;
    }
  }
}
