import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseBoolPipe,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiOperation,
  ApiProduces,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UsersResponseDTO } from '@modules/user/dto/user.dto';
import { CurrentUser } from '@schematics/decorators/custom.decorator';
import { RolesGuard } from '@schematics/guards/roles.guard';
import { DecodedTokenKey, ReactionType } from '@utils/types/utils.constant';
import {
  BaseResponseTypeDTO,
  PaginationRequestType,
} from '@utils/types/utils.types';
import { ArticleService } from './article.service';
import {
  ArticleResponseDTO,
  ArticlesResponseDTO,
  CreateArticleDTO,
  PublishArticleDTO,
  UpdateArticleDTO,
} from './dto/article.dto';

@ApiBearerAuth('JWT')
@ApiTags('article')
@Controller('article')
@UseGuards(RolesGuard)
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @ApiOperation({ description: 'Create new Article' })
  @ApiProduces('json')
  @ApiResponse({ type: ArticleResponseDTO })
  @ApiConsumes('application/json')
  @Post()
  async createArticle(
    @Body() payload: CreateArticleDTO,
    @CurrentUser(DecodedTokenKey.USER_ID) userId: string,
  ): Promise<ArticleResponseDTO> {
    return await this.articleService.createArticle(payload, userId);
  }

  @ApiOperation({ description: 'Create new Article' })
  @ApiProduces('json')
  @ApiResponse({ type: ArticleResponseDTO })
  @ApiConsumes('application/json')
  @Post('/publish-article')
  async publishArticle(
    @Body() payload: PublishArticleDTO,
  ): Promise<ArticleResponseDTO> {
    return await this.articleService.publishArticle(payload);
  }

  @ApiOperation({ description: 'Find all Articles' })
  @ApiProduces('json')
  @ApiResponse({ type: ArticlesResponseDTO })
  @Get()
  async findAll(
    @Query() payload?: PaginationRequestType,
  ): Promise<ArticlesResponseDTO> {
    return await this.articleService.findAllArticles(payload);
  }

  @ApiOperation({ description: 'Find specific article by id' })
  @ApiProduces('json')
  @ApiResponse({ type: ArticleResponseDTO })
  @Get('/:id')
  async findOne(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<ArticleResponseDTO> {
    return await this.articleService.findById(id);
  }

  @ApiOperation({ description: 'Find Articles by status' })
  @ApiProduces('json')
  @ApiResponse({ type: ArticlesResponseDTO })
  @Get('/find-by-status/:status')
  async findByStatus(
    @Param('status', ParseBoolPipe) status: boolean,
    @Query() payload?: PaginationRequestType,
  ): Promise<ArticlesResponseDTO> {
    return await this.articleService.findAllByStatus(status, payload);
  }

  @ApiOperation({ description: 'Update Article' })
  @ApiProduces('json')
  @ApiResponse({ type: BaseResponseTypeDTO })
  @ApiConsumes('application/json')
  @Patch()
  async updateArticle(
    @Body() payload: UpdateArticleDTO,
  ): Promise<BaseResponseTypeDTO> {
    return await this.articleService.updateArticle(payload);
  }

  @ApiOperation({ description: 'Delete Article' })
  @ApiProduces('json')
  @ApiResponse({ type: BaseResponseTypeDTO })
  @Delete('/delete-article/:id')
  async deleteArticle(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<BaseResponseTypeDTO> {
    return await this.articleService.deleteArticle(id);
  }

  @ApiOperation({ description: 'Like an Article' })
  @ApiProduces('json')
  @ApiResponse({ type: BaseResponseTypeDTO })
  @Get('/reaction/like/:articleId')
  async likeArticle(
    @Param('articleId', ParseUUIDPipe) articleId: string,
    @CurrentUser(DecodedTokenKey.USER_ID) userId: string,
  ): Promise<BaseResponseTypeDTO> {
    return await this.articleService.reactToArticle(
      { articleId, userId },
      ReactionType.LIKE,
    );
  }

  @ApiOperation({ description: 'Bookmark an Article' })
  @ApiProduces('json')
  @ApiResponse({ type: BaseResponseTypeDTO })
  @Get('/reaction/bookmark/:articleId')
  async bookmarkArticle(
    @Param('articleId', ParseUUIDPipe) articleId: string,
    @CurrentUser(DecodedTokenKey.USER_ID) userId: string,
  ): Promise<BaseResponseTypeDTO> {
    return await this.articleService.reactToArticle(
      { articleId, userId },
      ReactionType.BOOKMARK,
    );
  }

  @ApiOperation({ description: 'Mark user as having read an Article' })
  @ApiProduces('json')
  @ApiResponse({ type: BaseResponseTypeDTO })
  @Get('/reaction/mark-as-read/:articleId')
  async markArticleAsRead(
    @Param('articleId', ParseUUIDPipe) articleId: string,
    @CurrentUser(DecodedTokenKey.USER_ID) userId: string,
  ): Promise<BaseResponseTypeDTO> {
    return await this.articleService.reactToArticle(
      { articleId, userId },
      ReactionType.READ,
    );
  }

  @ApiOperation({
    description: 'Save user as having read an article',
  })
  @ApiProduces('json')
  @ApiResponse({ type: BaseResponseTypeDTO })
  @Get('/reaction/share-article/:articleId')
  async shareArticle(
    @Param('articleId', ParseUUIDPipe) articleId: string,
    @CurrentUser(DecodedTokenKey.USER_ID) userId: string,
  ): Promise<BaseResponseTypeDTO> {
    return await this.articleService.reactToArticle(
      { articleId, userId },
      ReactionType.SHARE,
    );
  }

  // Find users who reacted to an article
  @ApiOperation({
    description: 'Find users who liked an article',
  })
  @ApiProduces('json')
  @ApiResponse({ type: UsersResponseDTO })
  @Get('/reaction/find-users-liked/:articleId')
  async findUsersWhoLikedAnArticle(
    @Param('articleId', ParseUUIDPipe) articleId: string,
  ): Promise<UsersResponseDTO> {
    return await this.articleService.findUsersWhoReactedToAnArticle(
      articleId,
      ReactionType.LIKE,
    );
  }

  @ApiOperation({
    description: 'Find users who shared an article',
  })
  @ApiProduces('json')
  @ApiResponse({ type: UsersResponseDTO })
  @Get('/reaction/find-users-shared/:articleId')
  async findUsersWhoSharedAnArticle(
    @Param('articleId', ParseUUIDPipe) articleId: string,
  ): Promise<UsersResponseDTO> {
    return await this.articleService.findUsersWhoReactedToAnArticle(
      articleId,
      ReactionType.SHARE,
    );
  }

  @ApiOperation({
    description: 'Find users who bookmarked/saved an article',
  })
  @ApiProduces('json')
  @ApiResponse({ type: UsersResponseDTO })
  @Get('/reaction/find-users-bookmark/:articleId')
  async findUsersWhoBookmarkAnArticle(
    @Param('articleId', ParseUUIDPipe) articleId: string,
  ): Promise<UsersResponseDTO> {
    return await this.articleService.findUsersWhoReactedToAnArticle(
      articleId,
      ReactionType.BOOKMARK,
    );
  }

  @ApiOperation({
    description: 'Find users who bookmarked/saved an article',
  })
  @ApiProduces('json')
  @ApiResponse({ type: UsersResponseDTO })
  @Get('/reaction/find-users-read/:articleId')
  async findUsersWhoReadAnArticle(
    @Param('articleId', ParseUUIDPipe) articleId: string,
  ): Promise<UsersResponseDTO> {
    return await this.articleService.findUsersWhoReactedToAnArticle(
      articleId,
      ReactionType.READ,
    );
  }

  @ApiOperation({
    description: 'Find all articles for users using their saved interests',
  })
  @ApiProduces('json')
  @ApiResponse({ type: ArticlesResponseDTO })
  @Get('/timeline/get-all-user-articles')
  async findAllArticlesForUser(
    @CurrentUser(DecodedTokenKey.USER_ID) userId: string,
    @Query() payload?: PaginationRequestType,
  ): Promise<ArticlesResponseDTO> {
    return await this.articleService.findAllArticlesForUser(userId, payload);
  }

  @ApiOperation({
    description: 'Find all articles by interests',
  })
  @ApiProduces('json')
  @ApiResponse({ type: ArticlesResponseDTO })
  @Get('/timeline/get-articles-by-interest/:interestId')
  async findArticlesByInterest(
    @Param('interestId', ParseUUIDPipe) interestId: string,
    @Query() payload?: PaginationRequestType,
  ): Promise<ArticlesResponseDTO> {
    return await this.articleService.findArticlesByInterest(
      interestId,
      payload,
    );
  }

  @ApiOperation({
    description: 'Find saved articles for a user',
  })
  @ApiProduces('json')
  @ApiResponse({ type: ArticlesResponseDTO })
  @Get('/timeline/user/get-saved-articles')
  async findSavedArticles(
    @CurrentUser(DecodedTokenKey.USER_ID) userId: string,
    @Query() payload?: PaginationRequestType,
  ): Promise<ArticlesResponseDTO> {
    return await this.articleService.findSavedArticles(userId, payload);
  }
}
