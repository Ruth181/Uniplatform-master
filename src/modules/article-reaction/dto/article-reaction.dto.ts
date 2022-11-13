import { ApiProperty } from '@nestjs/swagger';

export class CreateArticleReactionDTO {
  @ApiProperty()
  userId: string;

  // @ApiProperty({ enum: ReactionType })
  // reaction: ReactionType;

  @ApiProperty()
  articleId: string;
}
