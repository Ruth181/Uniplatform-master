import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiProduces,
  ApiConsumes,
  ApiTags,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { CurrentUser } from '@schematics/decorators/custom.decorator';
import { RolesGuard } from '@schematics/guards/roles.guard';
import { DecodedTokenKey } from '@utils/types/utils.constant';
import { ArticleCommentReplyService } from './article-comment-reply.service';
import {
  ArticleCommentRepliesResponse,
  ArticleCommentReplyResponse,
  CreateArticleCommentReplyDTO,
} from './dto/article-comment-reply.dto';

@ApiBearerAuth('JWT')
@ApiTags('article-comment-reply')
@UseGuards(RolesGuard)
@Controller('article-comment-reply')
export class ArticleCommentReplyController {
  constructor(
    private readonly articleCommentRelyService: ArticleCommentReplyService,
  ) {}

  @ApiOperation({
    description: 'Find comment replies',
  })
  @ApiProduces('json')
  @ApiResponse({ type: () => ArticleCommentRepliesResponse })
  @Get(':articleCommentId')
  async findAllArticleComments(
    @Param('articleCommentId', ParseUUIDPipe) articleCommentId: string,
  ): Promise<ArticleCommentRepliesResponse> {
    return await this.articleCommentRelyService.replyBasedOnComment(
      articleCommentId,
    );
  }

  @ApiOperation({
    description: 'Create new comment reply',
  })
  @ApiProduces('json')
  @ApiConsumes('application/json')
  @ApiResponse({ type: () => ArticleCommentReplyResponse })
  @Post()
  async createArticleComments(
    @Body() payload: CreateArticleCommentReplyDTO,
    @CurrentUser(DecodedTokenKey.USER_ID) userId: string,
  ): Promise<ArticleCommentReplyResponse> {
    return await this.articleCommentRelyService.createCommentReply(
      payload,
      userId,
    );
  }
}
