import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import {
  ApiConsumes,
  ApiOperation,
  ApiProduces,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { BaseResponseTypeDTO } from '@utils/types/utils.types';
import { ArticleTagService } from './article-tag.service';
import {
  ArticleTagResponseDTO,
  CreateArticleTagDTO,
  UpdateArticleTagDTO,
} from './dto/article-tag.dto';

@ApiTags('article-tag')
@Controller('article-tag')
export class ArticleTagController {
  constructor(private readonly articleTagSrv: ArticleTagService) {}

  @ApiOperation({
    description: 'Find all article-tags',
  })
  @ApiProduces('json')
  @ApiResponse({ type: () => ArticleTagResponseDTO })
  @Get()
  async findAllArticleTags(): Promise<ArticleTagResponseDTO> {
    return await this.articleTagSrv.findAllTags();
  }

  @ApiOperation({
    description: 'Find article-tag by Id',
  })
  @ApiProduces('json')
  @ApiResponse({ type: () => ArticleTagResponseDTO })
  @Get('/find-by-id/:id')
  async findTagById(@Param('id') id: string): Promise<ArticleTagResponseDTO> {
    return await this.articleTagSrv.findTagById(id);
  }

  @ApiOperation({
    description: 'Create new article-tag',
  })
  @ApiProduces('json')
  @ApiConsumes('application/json')
  @ApiResponse({ type: () => ArticleTagResponseDTO })
  @Post('/create-tag')
  async createTag(
    @Body() payload: CreateArticleTagDTO,
  ): Promise<ArticleTagResponseDTO> {
    return await this.articleTagSrv.createArticleTag(payload);
  }

  @ApiOperation({
    description: 'deactivate article-tag / perform soft-delete',
  })
  @ApiProduces('json')
  @ApiConsumes('application/json')
  @ApiResponse({ type: () => BaseResponseTypeDTO })
  @Patch('/remove-tag')
  async updateTag(
    @Body() payload: UpdateArticleTagDTO,
  ): Promise<BaseResponseTypeDTO> {
    return await this.articleTagSrv.updateArticleTag(payload);
  }
}
