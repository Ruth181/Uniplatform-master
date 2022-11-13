import { ChatMessageReply } from '@entities/chat-message-reply.entity';
import { ApiProperty } from '@nestjs/swagger';
import { MessageType } from '@utils/types/utils.constant';
import {
  BaseResponseTypeDTO,
  PaginationResponseType,
} from '@utils/types/utils.types';

export class SendChatMessageReplyDTO {
  @ApiProperty({ enum: MessageType })
  type: MessageType;

  @ApiProperty()
  content: string;

  @ApiProperty()
  senderId: string;

  @ApiProperty()
  chatMessageId: string;
}

export class ChatMessageReplyResponseDTO extends BaseResponseTypeDTO {
  @ApiProperty({ type: () => ChatMessageReply })
  data: ChatMessageReply;
}

export class ChatMessageRepliesResponseDTO extends BaseResponseTypeDTO {
  @ApiProperty({ type: () => [ChatMessageReply] })
  data: ChatMessageReply[];

  @ApiProperty({ type: () => PaginationResponseType })
  paginationControl?: PaginationResponseType;
}
