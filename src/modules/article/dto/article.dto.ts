import { Article } from '@entities/article.entity';
import { ApiProperty, PartialType } from '@nestjs/swagger';
import {
  BaseResponseTypeDTO,
  PaginationResponseType,
} from '@utils/types/utils.types';

export class ArticleResponseDTO extends BaseResponseTypeDTO {
  @ApiProperty({
    type: () => Article,
  })
  data: Article;
}

export class ArticlesResponseDTO extends BaseResponseTypeDTO {
  @ApiProperty({
    type: () => [Article],
  })
  data: Article[];

  @ApiProperty({ type: () => PaginationResponseType })
  paginationControl?: PaginationResponseType;
}

export class CreateArticleDTO {
  @ApiProperty()
  title: string;

  @ApiProperty()
  body: string;

  @ApiProperty()
  coverPhoto: string;
}

export class UpdateArticleDTO extends PartialType(CreateArticleDTO) {
  @ApiProperty()
  articleId: string;

  @ApiProperty({
    type: Boolean,
  })
  status?: boolean;
}

export class PublishArticleDTO {
  @ApiProperty()
  articleId: string;

  @ApiProperty({ type: () => [String] })
  interestIds: string[];

  @ApiProperty()
  coverPhoto: string;
}
