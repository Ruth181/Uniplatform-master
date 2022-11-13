import { Socket } from 'socket.io';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';
import { ChatMessageService } from './chat-message.service';
import { Logger } from '@nestjs/common';
import { WebsocketEventType } from '@utils/types/utils.constant';
import {
  ChatMessageKeyboardEventTypeDTO,
  ChatMessagesResponseDTO,
  FindMessageThreadDTO,
  SocketSendChatMessageDTO,
} from './dto/chat-message.dto';
import { checkForRequiredFields } from '@utils/functions/utils.function';
import { UserProfileService } from '@modules/user-profile/user-profile.service';
import { ChatRoomService } from '@modules/chat-room/chat-room.service';

@WebSocketGateway({ namespace: '/chats' })
export class ChatMessageGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() webSocketServer: Socket;
  private logger = new Logger(ChatMessageGateway.name);
  private activeSockets: Socket[] = [];

  constructor(
    private readonly chatMessageSrv: ChatMessageService,
    private readonly userProfileSrv: UserProfileService,
    private readonly chatRoomSrv: ChatRoomService,
  ) {}

  afterInit(client: Socket) {
    this.logger.log('[Chat] has been initialized & ready to take connections');
  }

  handleConnection(@ConnectedSocket() client: Socket) {
    this.activeSockets.push(client);
    const message = `${this.activeSockets.length} clients connected successfully to the server`;
    this.logger.debug(message);
    client.emit('connection', message);
  }

  @SubscribeMessage(WebsocketEventType.USER_JOINED)
  async handleUserJoined(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: FindMessageThreadDTO,
  ): Promise<ChatMessagesResponseDTO> {
    try {
      checkForRequiredFields(['userId', 'peerUserId'], payload);
      const chatRoom = await this.chatRoomSrv.createChatRoom(
        payload.userId,
        payload.peerUserId,
      );
      const roomId = chatRoom.data.roomId;
      const messages = await this.chatMessageSrv.findMessageThread({
        peerUserId: payload.peerUserId,
        userId: payload.userId,
      });
      client.to(roomId).emit(WebsocketEventType.USER_JOINED_CONFIRMATION, {
        messages,
        roomId,
      });
      return messages;
    } catch (ex) {
      this.logger.error(ex);
      throw ex;
    }
  }

  @SubscribeMessage(WebsocketEventType.SEND_MESSAGE)
  async sendMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: SocketSendChatMessageDTO,
  ): Promise<ChatMessagesResponseDTO> {
    try {
      await this.chatMessageSrv.sendMessage(payload);
      const messages = await this.chatMessageSrv.findMessageThread({
        peerUserId: payload.receiverId,
        userId: payload.senderId,
      });
      client
        .to(payload.roomId)
        .emit(WebsocketEventType.USER_JOINED_CONFIRMATION, {
          messages,
          roomId: payload.roomId,
        });
      return messages;
    } catch (ex) {
      this.logger.error(ex);
      throw ex;
    }
  }

  @SubscribeMessage(WebsocketEventType.USER_TYPING)
  async handleUserTyping(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: ChatMessageKeyboardEventTypeDTO,
  ): Promise<string> {
    try {
      checkForRequiredFields(['roomId', 'userId'], payload);
      const user = await this.userProfileSrv.getRepo().findOne({
        where: { userId: payload.userId },
        select: ['id', 'firstName', 'lastName'],
      });
      let fullName = 'User';
      if (user?.id) {
        fullName = `${user.firstName} ${user.lastName}`;
      }
      const message = `${fullName} is typing...`;
      client
        .to(payload.roomId)
        .emit(WebsocketEventType.USER_TYPING_CONFIRMATION, {
          message,
          roomId: payload.roomId,
        });
      return message;
    } catch (ex) {
      throw ex;
    }
  }

  private broadcast<T>(event: WebsocketEventType, message: T): void {
    const broadCastMessage = JSON.stringify(message);
    for (const socket of this.activeSockets) {
      socket.send(event, broadCastMessage);
    }
  }

  handleDisconnect(@ConnectedSocket() client: Socket) {
    //Remove the user from list of webSockets
    const disconnectedWSIndex = this.activeSockets.findIndex(
      (ws) => ws === client,
    );
    this.activeSockets.splice(disconnectedWSIndex, 1);
    const message = `${this.activeSockets.length} clients disconnected from the websocket server`;
    this.logger.warn(message);
    client.emit('disconnection', message);
  }
}
