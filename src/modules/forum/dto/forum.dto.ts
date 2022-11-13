import { Forum } from '@entities/forum.entity';
import { ApiProperty, PickType } from '@nestjs/swagger';
import {
  BaseResponseTypeDTO,
  PaginationResponseType,
} from '@utils/types/utils.types';

export class CreateForumDTO extends PickType(Forum, [
  'title',
  'reference',
  'question',
] as const) {}

export class ForumsResponseDTO extends BaseResponseTypeDTO {
  @ApiProperty({ type: () => [Forum] })
  data: Forum[];

  @ApiProperty({ type: () => PaginationResponseType })
  paginationControl?: PaginationResponseType;
}

export class ForumResponseDTO extends BaseResponseTypeDTO {
  @ApiProperty({ type: () => Forum })
  data: Forum;
}
