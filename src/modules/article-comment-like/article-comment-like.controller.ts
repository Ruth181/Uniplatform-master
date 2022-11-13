import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import {
  ApiOperation,
  ApiTags,
  ApiBearerAuth,
  ApiProduces,
  ApiResponse,
} from '@nestjs/swagger';
import { CurrentUser } from '@schematics/decorators/custom.decorator';
import { RolesGuard } from '@schematics/guards/roles.guard';
import { DecodedTokenKey } from '@utils/types/utils.constant';
import { BaseResponseTypeDTO } from '@utils/types/utils.types';
import { ArticleCommentLikeService } from './article-comment-like.service';
import { ArticleCommentLikeDTO } from './dto/article-comment-like.dto';

@ApiBearerAuth('JWT')
@ApiTags('article-comment-like')
@UseGuards(RolesGuard)
@Controller('article-comment-like')
export class ArticleCommentLikeController {
  constructor(
    private readonly articleCommentLikeService: ArticleCommentLikeService,
  ) {}

  @ApiOperation({ description: 'Like a comment' })
  @ApiProduces('json')
  @ApiResponse({ type: BaseResponseTypeDTO })
  @Post()
  async createLikeRequest(
    @Body() payload: ArticleCommentLikeDTO,
    @CurrentUser(DecodedTokenKey.USER_ID) userId: string,
  ): Promise<BaseResponseTypeDTO> {
    return await this.articleCommentLikeService.createLikeRequest(
      payload,
      userId,
    );
  }
}
