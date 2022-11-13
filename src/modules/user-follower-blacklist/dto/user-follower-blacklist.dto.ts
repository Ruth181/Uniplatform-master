import { UserFollowerBlacklist } from '@entities/user-follower-blacklist.entity';
import { ApiProperty } from '@nestjs/swagger';
import {
  BaseResponseTypeDTO,
  PaginationResponseType,
} from '@utils/types/utils.types';

export class BlacklistUserFollowerDTO {
  @ApiProperty()
  blacklistedUserId: string;
}

export class UserFollowerBlacklistResponseDTO extends BaseResponseTypeDTO {
  @ApiProperty({ type: () => UserFollowerBlacklist })
  data?: UserFollowerBlacklist;
}

export class UserFollowerBlacklistsResponseDTO extends BaseResponseTypeDTO {
  @ApiProperty({ type: () => [UserFollowerBlacklist] })
  data?: UserFollowerBlacklist[];

  @ApiProperty({ type: () => PaginationResponseType })
  paginationControl?: PaginationResponseType;
}
