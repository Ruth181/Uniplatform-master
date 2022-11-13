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
  CreatePostDTO,
  PostResponseDTO,
  PostsResponseDTO,
} from './dto/post.dto';
import { PostService } from './post.service';

@ApiTags('post')
@ApiBearerAuth('JWT')
@UseGuards(RolesGuard)
@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @ApiOperation({ description: 'Find all posts' })
  @ApiProduces('json')
  @ApiResponse({ type: () => PostsResponseDTO })
  @Get()
  async findAllPosts(
    @Query() payload: PaginationRequestType,
  ): Promise<PostsResponseDTO> {
    return await this.postService.findAllPosts(payload);
  }

  @Get('/:postId')
  @ApiOperation({ description: 'Find post by id' })
  @ApiProduces('json')
  @ApiResponse({ type: () => PostResponseDTO })
  async findPostById(@Param('postId', ParseUUIDPipe) postId: string) {
    return await this.postService.findPostById(postId);
  }

  @Get('/find-posts/by-user')
  @ApiOperation({ description: 'Find posts made by user' })
  @ApiProduces('json')
  @ApiResponse({ type: () => PostsResponseDTO })
  async findPostsByUser(
    @Query() payload: PaginationRequestType,
    @CurrentUser(DecodedTokenKey.USER_ID) userId: string,
  ) {
    return await this.postService.findPostsMadeByUser(userId, payload);
  }

  @Post()
  @ApiConsumes('application/json')
  @ApiOperation({ description: 'Create new post' })
  @ApiProduces('json')
  @ApiResponse({ type: () => PostResponseDTO })
  async createNewPost(
    @Body() payload: CreatePostDTO,
    @CurrentUser(DecodedTokenKey.USER_ID) userId: string,
  ): Promise<PostResponseDTO> {
    return await this.postService.createNewPost(payload, userId);
  }

  @Delete('/:postId')
  @ApiOperation({ description: 'Delete post' })
  @ApiProduces('json')
  @ApiResponse({ type: () => BaseResponseTypeDTO })
  async deletePostById(
    @Param('postId', ParseUUIDPipe) postId: string,
  ): Promise<BaseResponseTypeDTO> {
    return await this.postService.deleteByPost(postId);
  }
}
