import { ChatMessageReply } from '@entities/chat-message-reply.entity';
import { BadRequestException, HttpStatus, Injectable } from '@nestjs/common';
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
  ChatMessageRepliesResponseDTO,
  ChatMessageReplyResponseDTO,
  SendChatMessageReplyDTO,
} from './dto/chat-message-reply.dto';

@Injectable()
export class ChatMessageReplyService extends GenericService(ChatMessageReply) {
  private relations = [
    'chatMessage',
    'chatMessage.sender',
    'chatMessage.receiver',
    'sender',
    'sender.userProfiles',
    'sender.userProfiles.institution',
    'sender.userProfiles.department',
  ];

  async createChatMessageReply(
    payload: SendChatMessageReplyDTO,
  ): Promise<ChatMessageReplyResponseDTO> {
    try {
      checkForRequiredFields(
        ['senderId', 'chatMessageId', 'content', 'type'],
        payload,
      );
      compareEnumValueFields(payload.type, Object.values(MessageType), 'type');
      validateUUIDField(payload.chatMessageId, 'chatMessageId');
      validateUUIDField(payload.senderId, 'senderId');
      const createdMessage = await this.create<Partial<ChatMessageReply>>(
        payload,
      );
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

  async findRepliesToChatThread(
    chatMessageId: string,
    paginationPayload?: PaginationRequestType,
  ): Promise<ChatMessageRepliesResponseDTO> {
    try {
      if (!chatMessageId) {
        throw new BadRequestException('Field chatMessageId is required');
      }
      validateUUIDField(chatMessageId, 'chatMessageId');
      const options: FindManyOptions = {
        where: { chatMessageId },
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
          await calculatePaginationControls<ChatMessageReply>(
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
