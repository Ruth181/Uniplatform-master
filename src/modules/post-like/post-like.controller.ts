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
  ApiBearerAuth,
  ApiOperation,
  ApiProduces,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CurrentUser } from '@schematics/decorators/custom.decorator';
import { RolesGuard } from '@schematics/guards/roles.guard';
import { DecodedTokenKey } from '@utils/types/utils.constant';
import {
  CreatePostLikeDTO,
  PostLikeResponseDTO,
  PostLikesCountResponseDTO,
} from './dto/post-like.dto';
import { PostLikeService } from './post-like.service';

@ApiBearerAuth('JWT')
@ApiTags('post-like')
@UseGuards(RolesGuard)
@Controller('post-like')
export class PostLikeController {
  constructor(private readonly postLikeService: PostLikeService) {}

  @ApiOperation({ description: 'Like Post' })
  @ApiProduces('json')
  @ApiResponse({ type: () => PostLikeResponseDTO })
  @Post()
  async createLike(
    @Body() payload: CreatePostLikeDTO,
    @CurrentUser(DecodedTokenKey.USER_ID) userId: string,
  ): Promise<PostLikeResponseDTO> {
    return await this.postLikeService.createPostLike(payload, userId);
  }

  @ApiOperation({ description: 'Get number of Likes on Post' })
  @ApiProduces('json')
  @ApiResponse({ type: () => PostLikesCountResponseDTO })
  @Get('/:postId')
  async getPostLikes(
    @Param('postId', ParseUUIDPipe) postId: string,
  ): Promise<PostLikesCountResponseDTO> {
    return await this.postLikeService.findTotalLikesForPost(postId);
  }
}
