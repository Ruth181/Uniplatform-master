import { GroupMember } from '@entities/group-member.entity';
import { ApiProperty } from '@nestjs/swagger';
import {
  BaseResponseTypeDTO,
  PaginationResponseType,
} from '@utils/types/utils.types';

export class CreateGroupMemberDTO {
  @ApiProperty()
  groupId: string;
}

export class GroupMemberResponseDTO extends BaseResponseTypeDTO {
  @ApiProperty({ type: () => GroupMember })
  data: GroupMember;
}

export class GroupMembersResponseDTO extends BaseResponseTypeDTO {
  @ApiProperty({ type: () => [GroupMember] })
  data: GroupMember[];

  @ApiProperty({ type: () => PaginationResponseType })
  paginationControl?: PaginationResponseType;
}
