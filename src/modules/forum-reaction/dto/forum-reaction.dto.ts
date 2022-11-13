import { ForumReaction } from '@entities/forum-reaction.entity';
import { ApiProperty } from '@nestjs/swagger';
import { ForumReactionType } from '@utils/types/utils.constant';
import {
  BaseResponseTypeDTO,
  PaginationResponseType,
} from '@utils/types/utils.types';

export class CreateForumReactionDTO {
  @ApiProperty()
  forumId: string;

  @ApiProperty({ enum: ForumReactionType })
  type: ForumReactionType;
}

export class ForumReactionsResponseDTO extends BaseResponseTypeDTO {
  @ApiProperty({ type: () => [ForumReaction] })
  data: ForumReaction[];

  @ApiProperty({ type: () => PaginationResponseType })
  paginationControl?: PaginationResponseType;
}

export class ForumReactionResponseDTO extends BaseResponseTypeDTO {
  @ApiProperty({ type: () => ForumReaction })
  data: ForumReaction;
}
