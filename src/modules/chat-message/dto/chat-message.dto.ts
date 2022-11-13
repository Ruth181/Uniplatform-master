import { ChatMessage } from '@entities/chat-message.entity';
import { ApiProperty } from '@nestjs/swagger';
import { MessageType } from '@utils/types/utils.constant';
import {
  BaseResponseTypeDTO,
  PaginationResponseType,
} from '@utils/types/utils.types';

export class SendChatMessageDTO {
  @ApiProperty()
  senderId: string;

  @ApiProperty()
  receiverId: string;

  @ApiProperty({ enum: MessageType })
  type: MessageType;

  @ApiProperty()
  content: string;
}

export class SocketSendChatMessageDTO extends SendChatMessageDTO {
  @ApiProperty()
  roomId: string;
}

export class FindMessageThreadDTO {
  @ApiProperty({ description: 'Logged in user' })
  userId: string;

  @ApiProperty({ description: 'Second user' })
  peerUserId: string;
}

export class ChatMessageKeyboardEventTypeDTO {
  @ApiProperty()
  roomId: string;

  @ApiProperty()
  userId: string;
}

export class ChatMessageResponseDTO extends BaseResponseTypeDTO {
  @ApiProperty({ type: () => ChatMessage })
  data: ChatMessage;
}

export class ChatMessagesResponseDTO extends BaseResponseTypeDTO {
  @ApiProperty({ type: () => [ChatMessage] })
  data: ChatMessage[];

  @ApiProperty({ type: () => PaginationResponseType })
  paginationControl?: PaginationResponseType;
}
