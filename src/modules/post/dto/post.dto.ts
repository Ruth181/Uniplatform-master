import { ApiProperty } from '@nestjs/swagger';
import { Post } from '@entities/post.entity';
import {
  BaseResponseTypeDTO,
  PaginationResponseType,
} from '@utils/types/utils.types';

export class PostResponseDTO extends BaseResponseTypeDTO {
  @ApiProperty({ type: () => Post })
  data: Post;
}

export class PostsResponseDTO extends BaseResponseTypeDTO {
  @ApiProperty({ type: () => [Post] })
  data: Post[];

  @ApiProperty({ type: () => PaginationResponseType })
  paginationControl?: PaginationResponseType;
}

export class CreatePostDTO {
  @ApiProperty()
  text: string;

  @ApiProperty()
  imageUrl: string;

  @ApiProperty()
  location: string;
}
