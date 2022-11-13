import { ArticleCommentReply } from '@entities/article-comment-reply.entity';
import { ApiProperty } from '@nestjs/swagger';
import { BaseResponseTypeDTO } from '@utils/types/utils.types';

export class CreateArticleCommentReplyDTO {
  @ApiProperty()
  articleCommentId: string;

  @ApiProperty()
  text: string;
}

export class ArticleCommentReplyResponse extends BaseResponseTypeDTO {
  @ApiProperty({ type: () => ArticleCommentReply })
  data: ArticleCommentReply;
}

export class ArticleCommentRepliesResponse extends BaseResponseTypeDTO {
  @ApiProperty({ type: () => [ArticleCommentReply] })
  data: ArticleCommentReply[];
}
