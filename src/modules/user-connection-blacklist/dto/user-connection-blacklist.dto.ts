import { UserConnectionBlacklist } from '@entities/user-connection-blacklist.entity';
import { ApiProperty } from '@nestjs/swagger';
import {
  BaseResponseTypeDTO,
  PaginationResponseType,
} from '@utils/types/utils.types';

export class BlacklistUserConnectionDTO {
  @ApiProperty()
  blacklistedUserId: string;
}

export class UserConnectionBlacklistResponseDTO extends BaseResponseTypeDTO {
  @ApiProperty({ type: () => UserConnectionBlacklist })
  data?: UserConnectionBlacklist;
}

export class UserConnectionBlacklistsResponseDTO extends BaseResponseTypeDTO {
  @ApiProperty({ type: () => [UserConnectionBlacklist] })
  data?: UserConnectionBlacklist[];

  @ApiProperty({ type: () => PaginationResponseType })
  paginationControl?: PaginationResponseType;
}
