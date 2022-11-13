import { ChatRoom } from '@entities/chat-room.entity';
import { ApiProperty } from '@nestjs/swagger';
import {
  BaseResponseTypeDTO,
  PaginationResponseType,
} from '@utils/types/utils.types';

export class ChatRoomResponseDTO extends BaseResponseTypeDTO {
  @ApiProperty({ type: () => ChatRoom })
  data: ChatRoom;
}

export class ChatRoomsResponseDTO extends BaseResponseTypeDTO {
  @ApiProperty({ type: () => [ChatRoom] })
  data: ChatRoom[];

  @ApiProperty({ type: () => PaginationResponseType })
  paginationControl?: PaginationResponseType;
}
