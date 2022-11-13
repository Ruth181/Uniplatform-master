import { GroupJoinRequest } from '@entities/group-join-request.entity';
import { ApiProperty } from '@nestjs/swagger';
import {
  BaseResponseTypeDTO,
  PaginationResponseType,
} from '@utils/types/utils.types';

export class CreateJoinGroupRequestDTO {
  @ApiProperty()
  groupId: string;
}

export class GroupJoinRequestResponseDTO extends BaseResponseTypeDTO {
  @ApiProperty({ type: () => GroupJoinRequest })
  data: GroupJoinRequest;
}

export class GroupJoinRequestsResponseDTO extends BaseResponseTypeDTO {
  @ApiProperty({ type: () => [GroupJoinRequest] })
  data: GroupJoinRequest[];

  @ApiProperty({ type: () => PaginationResponseType })
  paginationControl?: PaginationResponseType;
}
