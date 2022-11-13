import { PostComment } from '@entities/post-comment.entity';
import { ApiProperty, PartialType } from '@nestjs/swagger';
import {
  BaseResponseTypeDTO,
  PaginationResponseType,
} from '@utils/types/utils.types';

export class CreatePostCommentDTO {
  @ApiProperty()
  postId: string;

  @ApiProperty()
  text: string;
}

export class UpdatePostCommentDTO extends PartialType(CreatePostCommentDTO) {
  @ApiProperty()
  postCommentId: string;

  @ApiProperty({ type: Boolean })
  status?: boolean;
}

export class PostCommentResponseDTO extends BaseResponseTypeDTO {
  @ApiProperty({ type: () => PostComment })
  data?: PostComment;
}

export class PostCommentsResponseDTO extends BaseResponseTypeDTO {
  @ApiProperty({ type: () => [PostComment] })
  data?: PostComment[];

  @ApiProperty({ type: () => PaginationResponseType })
  paginationControl?: PaginationResponseType;
}
