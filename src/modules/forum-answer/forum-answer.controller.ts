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
  CreateForumAnswerReactionDTO,
  ForumAnswerReactionResponseDTO,
  ForumAnswerReactionsResponseDTO,
} from '@modules/forum-answer-reaction/dto/forum-answer-reaction.dto';
import { ForumAnswerReactionService } from '@modules/forum-answer-reaction/forum-answer-reaction.service';
import { CurrentUser } from '@schematics/decorators/custom.decorator';
import { RolesGuard } from '@schematics/guards/roles.guard';
import {
  DecodedTokenKey,
  ForumReactionType,
} from '@utils/types/utils.constant';
import {
  CreateForumAnswerDTO,
  ForumAnswerResponseDTO,
  ForumAnswersResponseDTO,
} from './dto/forum-answer.dto';
import { ForumAnswerService } from './forum-answer.service';

@ApiBearerAuth('JWT')
@UseGuards(RolesGuard)
@ApiTags('forum-answer')
@Controller('forum-answer')
export class ForumAnswerController {
  constructor(
    private readonly forumAnswerSrv: ForumAnswerService,
    private readonly forumAnswerReactionSrv: ForumAnswerReactionService,
  ) {}

  @ApiOperation({ description: 'Answer a Forum Question' })
  @ApiProduces('json')
  @ApiResponse({ type: () => ForumAnswerResponseDTO })
  @ApiConsumes('application/json')
  @Post()
  async answerForumQuestion(
    @Body() payload: CreateForumAnswerDTO,
    @CurrentUser(DecodedTokenKey.USER_ID) userId: string,
  ): Promise<ForumAnswerResponseDTO> {
    return await this.forumAnswerSrv.answerForumQuestion(payload, userId);
  }

  @ApiOperation({ description: 'Get answers to a forum question' })
  @ApiProduces('json')
  @ApiResponse({ type: () => ForumAnswersResponseDTO })
  @ApiConsumes('application/json')
  @Get('/:forumId')
  async findForumAnswerByForumId(
    @Param('forumId', ParseUUIDPipe) forumId: string,
  ): Promise<ForumAnswersResponseDTO> {
    return await this.forumAnswerSrv.findForumAnswerByForumId(forumId);
  }

  @ApiOperation({ description: 'Like a forum post answer' })
  @ApiProduces('json')
  @ApiResponse({ type: () => ForumAnswerReactionResponseDTO })
  @ApiConsumes('application/json')
  @Get('/reaction/like-answer/:forumAnswerId')
  async likeAnswer(
    @Param('forumAnswerId', ParseUUIDPipe) forumAnswerId: string,
    @CurrentUser(DecodedTokenKey.USER_ID) userId: string,
  ): Promise<ForumAnswerReactionResponseDTO> {
    return await this.forumAnswerReactionSrv.reactToForumAnswerPost(
      { forumAnswerId, type: ForumReactionType.LIKE },
      userId,
    );
  }

  @ApiOperation({ description: 'Dislike a forum post answer' })
  @ApiProduces('json')
  @ApiResponse({ type: () => ForumAnswerReactionResponseDTO })
  @ApiConsumes('application/json')
  @Get('/reaction/dislike-answer/:forumAnswerId')
  async dislikeAnswer(
    @Param('forumAnswerId', ParseUUIDPipe) forumAnswerId: string,
    @CurrentUser(DecodedTokenKey.USER_ID) userId: string,
  ): Promise<ForumAnswerReactionResponseDTO> {
    return await this.forumAnswerReactionSrv.reactToForumAnswerPost(
      { forumAnswerId, type: ForumReactionType.DISLIKE },
      userId,
    );
  }

  @ApiOperation({ description: 'Mark answer as relevant' })
  @ApiProduces('json')
  @ApiResponse({ type: () => ForumAnswerReactionResponseDTO })
  @ApiConsumes('application/json')
  @Get('/reaction/relevant-answer/:forumAnswerId')
  async answerRelevant(
    @Param('forumAnswerId', ParseUUIDPipe) forumAnswerId: string,
    @CurrentUser(DecodedTokenKey.USER_ID) userId: string,
  ): Promise<ForumAnswerReactionResponseDTO> {
    return await this.forumAnswerReactionSrv.reactToForumAnswerPost(
      { forumAnswerId, type: ForumReactionType.RELEVANT },
      userId,
    );
  }

  @ApiOperation({ description: 'Mark answer as non-relevant' })
  @ApiProduces('json')
  @ApiResponse({ type: () => ForumAnswerReactionResponseDTO })
  @ApiConsumes('application/json')
  @Get('/reaction/non-relevant-answer/:forumAnswerId')
  async answerNonRelevant(
    @Param('forumAnswerId', ParseUUIDPipe) forumAnswerId: string,
    @CurrentUser(DecodedTokenKey.USER_ID) userId: string,
  ): Promise<ForumAnswerReactionResponseDTO> {
    return await this.forumAnswerReactionSrv.reactToForumAnswerPost(
      { forumAnswerId, type: ForumReactionType.NOT_RELEVANT },
      userId,
    );
  }

  @ApiOperation({ description: 'Mark answer as viewed' })
  @ApiProduces('json')
  @ApiResponse({ type: () => ForumAnswerReactionResponseDTO })
  @ApiConsumes('application/json')
  @Get('/reaction/viewed-answer/:forumAnswerId')
  async answerViewed(
    @Param('forumAnswerId', ParseUUIDPipe) forumAnswerId: string,
    @CurrentUser(DecodedTokenKey.USER_ID) userId: string,
  ): Promise<ForumAnswerReactionResponseDTO> {
    return await this.forumAnswerReactionSrv.reactToForumAnswerPost(
      { forumAnswerId, type: ForumReactionType.VIEW },
      userId,
    );
  }

  @ApiOperation({ description: 'Find reactions for a post answer' })
  @ApiProduces('json')
  @ApiResponse({ type: () => ForumAnswerReactionsResponseDTO })
  @ApiConsumes('application/json')
  @ApiQuery({ enum: ForumReactionType, name: 'type' })
  @Get('/reaction/find-forum-answer-reaction')
  async findForumAnswerReactions(
    @Query() payload: CreateForumAnswerReactionDTO,
  ): Promise<ForumAnswerReactionsResponseDTO> {
    return await this.forumAnswerReactionSrv.findForumAnswerReactions(payload);
  }
}
