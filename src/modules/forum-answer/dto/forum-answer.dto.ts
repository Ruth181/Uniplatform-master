import { ForumAnswer } from '@entities/forum-answer.entity';
import { ApiProperty, PickType } from '@nestjs/swagger';
import {
  BaseResponseTypeDTO,
  PaginationResponseType,
} from '@utils/types/utils.types';

export class CreateForumAnswerDTO extends PickType(ForumAnswer, [
  'text',
] as const) {
  @ApiProperty()
  forumId: string;
}

export class ForumAnswersResponseDTO extends BaseResponseTypeDTO {
  @ApiProperty({ type: () => [ForumAnswer] })
  data: ForumAnswer[];

  @ApiProperty({ type: () => PaginationResponseType })
  paginationControl?: PaginationResponseType;
}

export class ForumAnswerResponseDTO extends BaseResponseTypeDTO {
  @ApiProperty({ type: () => ForumAnswer })
  data: ForumAnswer;
}
