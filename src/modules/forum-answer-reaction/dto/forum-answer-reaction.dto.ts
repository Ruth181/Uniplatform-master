import { ForumAnswerReaction } from '@entities/forum-answer-reaction.entity';
import { ApiProperty } from '@nestjs/swagger';
import { ForumReactionType } from '@utils/types/utils.constant';
import {
  BaseResponseTypeDTO,
  PaginationResponseType,
} from '@utils/types/utils.types';

export class CreateForumAnswerReactionDTO {
  @ApiProperty()
  forumAnswerId: string;

  @ApiProperty({ enum: ForumReactionType })
  type: ForumReactionType;
}

export class ForumAnswerReactionsResponseDTO extends BaseResponseTypeDTO {
  @ApiProperty({ type: () => [ForumAnswerReaction] })
  data: ForumAnswerReaction[];

  @ApiProperty({ type: () => PaginationResponseType })
  paginationControl?: PaginationResponseType;
}

export class ForumAnswerReactionResponseDTO extends BaseResponseTypeDTO {
  @ApiProperty({ type: () => ForumAnswerReaction })
  data: ForumAnswerReaction;
}
