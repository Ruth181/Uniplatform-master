import { ApiProperty } from '@nestjs/swagger';
import { UserConnection } from '@entities/user-connection.entity';
import {
  BaseResponseTypeDTO,
  PaginationResponseType,
} from '@utils/types/utils.types';

export class CreateUserConnectionDTO {
  @ApiProperty()
  userId: string;
}

export class UserConnectionResponseDTO extends BaseResponseTypeDTO {
  @ApiProperty({ type: () => UserConnection })
  data: UserConnection;
}

export class UserConnectionsResponseDTO extends BaseResponseTypeDTO {
  @ApiProperty({ type: () => [UserConnection] })
  data: UserConnection[];

  @ApiProperty({ type: () => PaginationResponseType })
  paginationControl?: PaginationResponseType;
}
