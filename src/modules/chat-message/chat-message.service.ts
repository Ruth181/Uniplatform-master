import { ChatMessage } from '@entities/chat-message.entity';
import { HttpStatus, Injectable } from '@nestjs/common';
import { GenericService } from '@schematics/services/generic.service';
import {
  calculatePaginationControls,
  checkForRequiredFields,
  compareEnumValueFields,
  validateUUIDField,
} from '@utils/functions/utils.function';
import { MessageType } from '@utils/types/utils.constant';
import { PaginationRequestType } from '@utils/types/utils.types';
import { FindManyOptions } from 'typeorm';
import {
  SendChatMessageDTO,
  ChatMessageResponseDTO,
  ChatMessagesResponseDTO,
  FindMessageThreadDTO,
} from './dto/chat-message.dto';

@Injectable()
export class ChatMessageService extends GenericService(ChatMessage) {
  private relations = [
    'sender',
    'sender.userProfiles',
    'sender.userProfiles.institution',
    'sender.userProfiles.department',
    'receiver',
    'receiver.userProfiles',
    'receiver.userProfiles.institution',
    'receiver.userProfiles.department',
    'repliesMadeThisMessage',
    'repliesMadeThisMessage.sender',
    'repliesMadeThisMessage.sender.userProfiles',
  ];

  async sendMessage(
    payload: SendChatMessageDTO,
  ): Promise<ChatMessageResponseDTO> {
    try {
      checkForRequiredFields(
        ['receiverId', 'type', 'content', 'senderId'],
        payload,
      );
      compareEnumValueFields(payload.type, Object.values(MessageType), 'type');
      validateUUIDField(payload.senderId, 'senderId');
      validateUUIDField(payload.receiverId, 'receiverId');
      const createdMessage = await this.create<Partial<ChatMessage>>(payload);
      return {
        success: true,
        code: HttpStatus.CREATED,
        data: createdMessage,
        message: 'Created',
      };
    } catch (ex) {
      this.logger.error(ex);
      throw ex;
    }
  }

  async findMessageThread(
    payload: FindMessageThreadDTO,
    paginationPayload?: PaginationRequestType,
  ): Promise<ChatMessagesResponseDTO> {
    try {
      checkForRequiredFields(['userId', 'peerUserId'], payload);
      validateUUIDField(payload.userId, 'userId');
      validateUUIDField(payload.peerUserId, 'peerUserId');
      const options: FindManyOptions = {
        where: [
          { senderId: payload.userId, receiverId: payload.peerUserId },
          { receiverId: payload.userId, senderId: payload.peerUserId },
        ],
        order: { dateCreated: 'ASC' },
        relations: this.relations,
      };
      if (paginationPayload?.pageNumber) {
        paginationPayload = {
          pageNumber: parseInt(`${paginationPayload.pageNumber}`),
          pageSize: parseInt(`${paginationPayload.pageSize}`),
        };
        options.take = paginationPayload.pageSize;
        options.skip =
          (paginationPayload.pageNumber - 1) * paginationPayload.pageSize;
        const { response, paginationControl } =
          await calculatePaginationControls<ChatMessage>(
            this.getRepo(),
            options,
            paginationPayload,
          );
        return {
          success: true,
          message: 'Records found',
          code: HttpStatus.OK,
          data: response,
          paginationControl: paginationControl,
        };
      }
      const records = await this.getRepo().find(options);
      return {
        success: true,
        code: HttpStatus.OK,
        data: records,
        message: 'Records found',
      };
    } catch (ex) {
      this.logger.error(ex);
      throw ex;
    }
  }
}
