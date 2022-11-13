import { ChatMessageKeyboardEventTypeDTO } from '@modules/chat-message/dto/chat-message.dto';
import { UserProfileService } from '@modules/user-profile/user-profile.service';
import { Logger } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { checkForRequiredFields } from '@utils/functions/utils.function';
import { WebsocketEventType } from '@utils/types/utils.constant';
import { Socket } from 'socket.io';
import {
  SendGroupChatMessageDTO,
  GroupChatMessagesResponseDTO,
  FindGroupMessageThreadDTO,
} from './dto/group-chat.dto';
import { GroupChatMessageService } from './group-chat.service';

@WebSocketGateway({ namespace: '/group-chats' })
export class GroupChatMessageGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() webSocketServer: Socket;
  private logger = new Logger(GroupChatMessageGateway.name);
  private activeSockets: Socket[] = [];

  constructor(
    private readonly groupChatMessageSrv: GroupChatMessageService,
    private readonly userProfileSrv: UserProfileService,
  ) {}

  afterInit(client: Socket) {
    this.logger.log(
      '[Group-Chat] has been initialized & ready to take connections',
    );
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
    @MessageBody() payload: FindGroupMessageThreadDTO,
  ): Promise<GroupChatMessagesResponseDTO> {
    try {
      checkForRequiredFields(['groupId'], payload);
      const messages = await this.groupChatMessageSrv.findGroupMessageThread(
        payload.groupId,
      );
      client
        .to(payload.groupId)
        .emit(WebsocketEventType.USER_JOINED_CONFIRMATION, {
          messages,
          roomId: payload.groupId,
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
    @MessageBody() payload: SendGroupChatMessageDTO,
  ): Promise<GroupChatMessagesResponseDTO> {
    await this.groupChatMessageSrv.sendGroupMessage(payload);
    const messages = await this.groupChatMessageSrv.findGroupMessageThread(
      payload.groupId,
    );
    client
      .to(payload.groupId)
      .emit(WebsocketEventType.USER_JOINED_CONFIRMATION, {
        messages,
        roomId: payload.groupId,
      });
    return messages;
  }

  @SubscribeMessage(WebsocketEventType.USER_TYPING)
  async handleUserTyping(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: ChatMessageKeyboardEventTypeDTO,
  ): Promise<string> {
    try {
      // roomId is groupId
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
