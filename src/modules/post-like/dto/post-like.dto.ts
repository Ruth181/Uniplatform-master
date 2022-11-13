import { PostLike } from '@entities/post-like.entity';
import { ApiProperty } from '@nestjs/swagger';
import { BaseResponseTypeDTO } from '@utils/types/utils.types';

export class CreatePostLikeDTO {
  @ApiProperty()
  postId: string;
}

export class PostLikeResponseDTO extends BaseResponseTypeDTO {
  @ApiProperty({ type: () => PostLike })
  data?: PostLike;
}

export class PostLikesCountResponseDTO extends BaseResponseTypeDTO {
  @ApiProperty({ type: () => [PostLike] })
  data?: PostLike[];

  @ApiProperty({ type: Number })
  count: number;
}
