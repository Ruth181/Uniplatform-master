import { ApiProperty } from '@nestjs/swagger';

export class ArticleCommentLikeDTO {
  @ApiProperty()
  articleCommentId: string;
}
