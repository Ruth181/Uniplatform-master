import { GroupChatMessageReply } from '@entities/group-chat-message-reply.entity';
import { ApiProperty } from '@nestjs/swagger';
import { MessageType } from '@utils/types/utils.constant';
import {
  BaseResponseTypeDTO,
  PaginationResponseType,
} from '@utils/types/utils.types';

export class SendGroupChatMessageReplyDTO {
  @ApiProperty({ enum: MessageType })
  type: MessageType;

  @ApiProperty()
  content: string;

  @ApiProperty()
  senderId: string;

  @ApiProperty()
  groupChatMessageId: string;
}

export class GroupChatMessageReplyResponseDTO extends BaseResponseTypeDTO {
  @ApiProperty({ type: () => GroupChatMessageReply })
  data: GroupChatMessageReply;
}

export class GroupChatMessageRepliesResponseDTO extends BaseResponseTypeDTO {
  @ApiProperty({ type: () => [GroupChatMessageReply] })
  data: GroupChatMessageReply[];

  @ApiProperty({ type: () => PaginationResponseType })
  paginationControl?: PaginationResponseType;
}
