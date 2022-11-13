import { ArticleComment } from "@entities/article-comment.entity";
import { ApiProperty } from "@nestjs/swagger";
import { BaseResponseTypeDTO } from "@utils/types/utils.types";

export class CreateArticleCommentDTO{

    @ApiProperty({type : 'uuid'})
    articleId : string;

    @ApiProperty()
    text : string;
}

export class ArticleCommentResponseDTO extends BaseResponseTypeDTO {
    @ApiProperty({
      type: () => ArticleComment,
    })
    data: ArticleComment;
  }
  
  export class ArticleCommentsResponseDTO extends BaseResponseTypeDTO {
    @ApiProperty({
      type: () => [ArticleComment],
    })
    data: ArticleComment[];
  }