import { UserFollower } from '@entities/user-follower.entity';
import { ApiProperty } from '@nestjs/swagger';
import {
  BaseResponseTypeDTO,
  PaginationResponseType,
} from '@utils/types/utils.types';

export class CreateUserFollowerDTO {
  @ApiProperty()
  userId: string;
}

export class UserFollowerResponseDTO extends BaseResponseTypeDTO {
  @ApiProperty({ type: () => UserFollower })
  data: UserFollower;
}

export class UserFollowersResponseDTO extends BaseResponseTypeDTO {
  @ApiProperty({ type: () => [UserFollower] })
  data: UserFollower[];

  @ApiProperty({ type: () => PaginationResponseType })
  paginationControl?: PaginationResponseType;
}
