import { Group } from '@entities/group.entity';
import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';
import {
  BaseResponseTypeDTO,
  PaginationResponseType,
} from '@utils/types/utils.types';

export class CreateGroupDTO {
  @ApiProperty()
  name: string;

  @ApiProperty()
  groupPhoto: string;

  @ApiProperty()
  groupBio: string;

  @ApiProperty()
  isPrivate: boolean;

  @ApiProperty({ nullable: true })
  peopleToInvite?: string[];
}

export class UpdateGroupDTO extends PartialType(
  OmitType(CreateGroupDTO, ['peopleToInvite'] as const),
) {
  @ApiProperty()
  groupId: string;

  @ApiProperty({ nullable: true })
  status?: boolean;
}

export class GroupResponseDTO extends BaseResponseTypeDTO {
  @ApiProperty({ type: () => Group })
  data: Group;
}

export class GroupsResponseDTO extends BaseResponseTypeDTO {
  @ApiProperty({ type: () => [Group] })
  data: Group[];

  @ApiProperty({ type: () => PaginationResponseType })
  paginationControl?: PaginationResponseType;
}
