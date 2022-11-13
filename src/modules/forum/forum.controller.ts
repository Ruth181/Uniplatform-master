import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiOperation,
  ApiProduces,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  CreateForumReactionDTO,
  ForumReactionResponseDTO,
  ForumReactionsResponseDTO,
} from '@modules/forum-reaction/dto/forum-reaction.dto';
import { ForumReactionService } from '@modules/forum-reaction/forum-reaction.service';
import { CurrentUser } from '@schematics/decorators/custom.decorator';
import { RolesGuard } from '@schematics/guards/roles.guard';
import {
  DecodedTokenKey,
  ForumReactionType,
} from '@utils/types/utils.constant';
import { PaginationRequestType } from '@utils/types/utils.types';
import {
  CreateForumDTO,
  ForumResponseDTO,
  ForumsResponseDTO,
} from './dto/forum.dto';
import { ForumService } from './forum.service';

@ApiBearerAuth('JWT')
@ApiTags('forum')
@UseGuards(RolesGuard)
@Controller('forum')
export class ForumController {
  constructor(
    private readonly forumSrv: ForumService,
    private readonly forumReactionSrv: ForumReactionService,
  ) {}

  @ApiOperation({ description: 'Create new Forum Question' })
  @ApiProduces('json')
  @ApiResponse({ type: ForumResponseDTO })
  @ApiConsumes('application/json')
  @Post()
  async createForumEntry(
    @Body() payload: CreateForumDTO,
    @CurrentUser(DecodedTokenKey.USER_ID) userId: string,
  ): Promise<ForumResponseDTO> {
    return await this.forumSrv.createForumEntry(payload, userId);
  }

  @ApiOperation({ description: 'Find Forum Question by id' })
  @ApiProduces('json')
  @ApiResponse({ type: ForumsResponseDTO })
  @ApiConsumes('application/json')
  @Get()
  async findForumEntries(
    @Query() payload?: PaginationRequestType,
  ): Promise<ForumsResponseDTO> {
    return await this.forumSrv.findForumEntries(payload);
  }

  @Get('/filter/by-userId/:userId')
  async findForumEntriesByUserId(
    @Param('userId', ParseUUIDPipe) userId: string,
    @Query() payload?: PaginationRequestType,
  ): Promise<ForumsResponseDTO> {
    return await this.forumSrv.findForumEntriesByUserId(userId, payload);
  }

  @ApiOperation({ description: 'Find Forum Question by id' })
  @ApiProduces('json')
  @ApiResponse({ type: ForumResponseDTO })
  @ApiConsumes('application/json')
  @Get('/:forumId')
  async findForumEntryById(
    @Param('forumId', ParseUUIDPipe) forumId: string,
  ): Promise<ForumResponseDTO> {
    return await this.forumSrv.findForumEntryById(forumId);
  }

  @ApiOperation({ description: 'Find Forum Question by id' })
  @ApiProduces('json')
  @ApiResponse({ type: ForumsResponseDTO })
  @ApiConsumes('application/json')
  @Get('/search/forum-entries')
  async searchForumEntries(
    @Query('searchTerm') searchTerm: string,
    @Query() payload?: PaginationRequestType,
  ): Promise<ForumsResponseDTO> {
    return await this.forumSrv.searchForumEntries(searchTerm, payload);
  }

  @ApiOperation({ description: 'Like a forum post' })
  @ApiProduces('json')
  @ApiResponse({ type: () => ForumReactionResponseDTO })
  @ApiConsumes('application/json')
  @Get('/reaction/like-forum-post/:forumId')
  async reactAndLikeForumPost(
    @Param('forumId', ParseUUIDPipe) forumId: string,
    @CurrentUser(DecodedTokenKey.USER_ID) userId: string,
  ): Promise<ForumReactionResponseDTO> {
    return await this.forumReactionSrv.reactToForumPost(
      { forumId, type: ForumReactionType.LIKE },
      userId,
    );
  }

  @ApiOperation({ description: 'Dislike a forum post' })
  @ApiProduces('json')
  @ApiResponse({ type: () => ForumReactionResponseDTO })
  @ApiConsumes('application/json')
  @Get('/reaction/dislike-forum-post/:forumId')
  async reactAndDisLikeForumPost(
    @Param('forumId', ParseUUIDPipe) forumId: string,
    @CurrentUser(DecodedTokenKey.USER_ID) userId: string,
  ): Promise<ForumReactionResponseDTO> {
    return await this.forumReactionSrv.reactToForumPost(
      { forumId, type: ForumReactionType.DISLIKE },
      userId,
    );
  }

  @ApiOperation({ description: 'Mark post as Relevant' })
  @ApiProduces('json')
  @ApiResponse({ type: () => ForumReactionResponseDTO })
  @ApiConsumes('application/json')
  @Get('/reaction/relevant-forum-post/:forumId')
  async forumPostRelevant(
    @Param('forumId', ParseUUIDPipe) forumId: string,
    @CurrentUser(DecodedTokenKey.USER_ID) userId: string,
  ): Promise<ForumReactionResponseDTO> {
    return await this.forumReactionSrv.reactToForumPost(
      { forumId, type: ForumReactionType.RELEVANT },
      userId,
    );
  }

  @ApiOperation({ description: 'Mark post as Viewed' })
  @ApiProduces('json')
  @ApiResponse({ type: () => ForumReactionResponseDTO })
  @ApiConsumes('application/json')
  @Get('/reaction/forum-post-viewed/:forumId')
  async forumPostViewed(
    @Param('forumId', ParseUUIDPipe) forumId: string,
    @CurrentUser(DecodedTokenKey.USER_ID) userId: string,
  ): Promise<ForumReactionResponseDTO> {
    return await this.forumReactionSrv.reactToForumPost(
      { forumId, type: ForumReactionType.VIEW },
      userId,
    );
  }

  @ApiOperation({ description: 'Mark post as UniRelevant a forum post' })
  @ApiProduces('json')
  @ApiResponse({ type: () => ForumReactionResponseDTO })
  @ApiConsumes('application/json')
  @Get('/reaction/non-relevant-forum-post/:forumId')
  async forumPostNotRelevant(
    @Param('forumId', ParseUUIDPipe) forumId: string,
    @CurrentUser(DecodedTokenKey.USER_ID) userId: string,
  ): Promise<ForumReactionResponseDTO> {
    return await this.forumReactionSrv.reactToForumPost(
      { forumId, type: ForumReactionType.NOT_RELEVANT },
      userId,
    );
  }

  @ApiOperation({ description: 'Dislike a forum post' })
  @ApiProduces('json')
  @ApiResponse({ type: () => ForumReactionResponseDTO })
  @ApiConsumes('application/json')
  @Get('/reaction/dislike-forum-post/:forumId')
  async dislikeForumPost(
    @Param('forumId', ParseUUIDPipe) forumId: string,
    @CurrentUser(DecodedTokenKey.USER_ID) userId: string,
  ): Promise<ForumReactionResponseDTO> {
    return await this.forumReactionSrv.reactToForumPost(
      { forumId, type: ForumReactionType.DISLIKE },
      userId,
    );
  }

  @ApiOperation({ description: 'Find reactions for a post' })
  @ApiProduces('json')
  @ApiResponse({ type: () => ForumReactionsResponseDTO })
  @ApiConsumes('application/json')
  @ApiQuery({ enum: ForumReactionType, name: 'type' })
  @Get('/reaction/find-forum-reaction')
  async findForumReactions(
    @Query() payload: CreateForumReactionDTO,
  ): Promise<ForumReactionsResponseDTO> {
    return await this.forumReactionSrv.findForumReactions(payload);
  }
}
