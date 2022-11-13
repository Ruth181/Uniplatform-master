import { GroupChatMessage } from '@entities/group-chat-message.entity';
import { ApiProperty } from '@nestjs/swagger';
import { MessageType } from '@utils/types/utils.constant';
import {
  BaseResponseTypeDTO,
  PaginationResponseType,
} from '@utils/types/utils.types';

export class SendGroupChatMessageDTO {
  @ApiProperty()
  groupId: string;

  @ApiProperty()
  content: string;

  @ApiProperty({ enum: MessageType })
  type: MessageType;

  @ApiProperty()
  senderId: string;
}

export class FindGroupMessageThreadDTO {
  @ApiProperty()
  groupId: string;
}

export class GroupChatMessageResponseDTO extends BaseResponseTypeDTO {
  @ApiProperty({ type: () => GroupChatMessage })
  data: GroupChatMessage;
}

export class GroupChatMessagesResponseDTO extends BaseResponseTypeDTO {
  @ApiProperty({ type: () => [GroupChatMessage] })
  data: GroupChatMessage[];

  @ApiProperty({ type: () => PaginationResponseType })
  paginationControl?: PaginationResponseType;
}

export class GroupChatFilterTypeDTO {
  @ApiProperty({ enum: MessageType })
  type: MessageType;

  @ApiProperty()
  groupId: string;
}
