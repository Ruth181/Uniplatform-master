import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
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
import { CurrentUser } from '@schematics/decorators/custom.decorator';
import { RolesGuard } from '@schematics/guards/roles.guard';
import { DecodedTokenKey } from '@utils/types/utils.constant';
import { BaseResponseTypeDTO } from '@utils/types/utils.types';
import {
  CreatePostCommentReplyDTO,
  PostCommentRepliesResponseDTO,
  PostCommentReplyResponseDTO,
} from './dto/post-comment-reply.dto';
import { PostCommentReplyService } from './post-comment-reply.service';

@ApiBearerAuth('JWT')
@ApiTags('post-comment-reply')
@UseGuards(RolesGuard)
@Controller('post-comment-reply')
export class PostCommentReplyController {
  constructor(
    private readonly postCommentReplyService: PostCommentReplyService,
  ) {}

  @ApiOperation({ description: 'Find Replies to a specific comment' })
  @ApiProduces('json')
  @ApiResponse({ type: () => PostCommentRepliesResponseDTO })
  @Get('/:postCommentId')
  async findRepliesUnderComment(
    @Param('postCommentId', ParseUUIDPipe) postCommentId: string,
  ): Promise<PostCommentRepliesResponseDTO> {
    return await this.postCommentReplyService.findRepliesUnderComment(
      postCommentId,
    );
  }

  @ApiOperation({
    description: 'Find Replies made by a user to a specific comment',
  })
  @ApiProduces('json')
  @ApiResponse({ type: () => PostCommentRepliesResponseDTO })
  @Get('/find-reply-by-user-under-comment/:postCommentId')
  async findReplyByUserUnderComment(
    @Param('postCommentId', ParseUUIDPipe) postCommentId: string,
    @CurrentUser(DecodedTokenKey.USER_ID) userId: string,
  ): Promise<PostCommentRepliesResponseDTO> {
    return await this.postCommentReplyService.findRepliesMadeByUserForPostComment(
      userId,
      postCommentId,
    );
  }

  @ApiOperation({ description: 'Send a new reply request' })
  @ApiConsumes('application/json')
  @ApiProduces('json')
  @ApiResponse({ type: () => PostCommentReplyResponseDTO })
  @Post()
  async createReplyRequest(
    @Body() payload: CreatePostCommentReplyDTO,
    @CurrentUser(DecodedTokenKey.USER_ID) userId: string,
  ): Promise<PostCommentReplyResponseDTO> {
    return await this.postCommentReplyService.createReply(payload, userId);
  }

  @ApiOperation({ description: 'Delete a reply' })
  @ApiProduces('json')
  @ApiResponse({ type: () => BaseResponseTypeDTO })
  @Delete('/:postCommentReplyId')
  async deletePostCommentReply(
    @Param('postCommentReplyId', ParseUUIDPipe) postCommentReplyId: string,
  ): Promise<BaseResponseTypeDTO> {
    return await this.postCommentReplyService.deleteCommentReplyById(
      postCommentReplyId,
    );
  }
}
