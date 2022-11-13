import {
  Body,
  Controller,
  Delete,
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
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CurrentUser } from '@schematics/decorators/custom.decorator';
import { RolesGuard } from '@schematics/guards/roles.guard';
import { DecodedTokenKey } from '@utils/types/utils.constant';
import {
  BaseResponseTypeDTO,
  PaginationRequestType,
} from '@utils/types/utils.types';
import {
  CreatePostCommentDTO,
  PostCommentResponseDTO,
  PostCommentsResponseDTO,
} from './dto/post-comment.dto';
import { PostCommentService } from './post-comment.service';

@ApiBearerAuth('JWT')
@ApiTags('post-comment')
@UseGuards(RolesGuard)
@Controller('post-comment')
export class PostCommentController {
  constructor(private readonly postCommentSrv: PostCommentService) {}

  @Post()
  @ApiConsumes('application/json')
  @ApiOperation({ description: 'Create new Comment Under Post' })
  @ApiProduces('json')
  @ApiResponse({ type: () => PostCommentResponseDTO })
  async createNewComment(
    @Body() payload: CreatePostCommentDTO,
    @CurrentUser(DecodedTokenKey.USER_ID) userId: string,
  ): Promise<PostCommentResponseDTO> {
    return await this.postCommentSrv.createComment(payload, userId);
  }

  @Get('/find-comments-by-user')
  @ApiOperation({ description: 'Find Comments made by user' })
  @ApiProduces('json')
  @ApiResponse({ type: () => PostCommentsResponseDTO })
  async findByUser(
    @CurrentUser(DecodedTokenKey.USER_ID) userId: string,
    @Query() payload?: PaginationRequestType,
  ): Promise<PostCommentsResponseDTO> {
    return await this.postCommentSrv.findCommentsByUserId(userId, payload);
  }

  @Get('/:postId')
  @ApiOperation({ description: 'Find Comments under post' })
  @ApiProduces('json')
  @ApiResponse({ type: () => PostCommentsResponseDTO })
  async findCommentsUnderPost(
    @Param('postId', ParseUUIDPipe) postId: string,
    @Query() payload?: PaginationRequestType,
  ): Promise<PostCommentsResponseDTO> {
    return await this.postCommentSrv.findCommentsUnderPost(postId, payload);
  }

  @Delete('/:postCommentId')
  @ApiOperation({ description: 'Delete Comment' })
  @ApiProduces('json')
  @ApiResponse({ type: () => BaseResponseTypeDTO })
  async deleteComment(
    @Param('postCommentId', ParseUUIDPipe) postCommentId: string,
  ): Promise<BaseResponseTypeDTO> {
    return await this.postCommentSrv.deleteByPostComment(postCommentId);
  }
}
