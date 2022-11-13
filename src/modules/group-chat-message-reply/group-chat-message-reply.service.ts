import { GroupChatMessageReply } from '@entities/group-chat-message-reply.entity';
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
  GroupChatMessageRepliesResponseDTO,
  GroupChatMessageReplyResponseDTO,
  SendGroupChatMessageReplyDTO,
} from './dto/group-chat-message.dto';

@Injectable()
export class GroupChatMessageReplyService extends GenericService(
  GroupChatMessageReply,
) {
  private relations = [
    'user',
    'user.userProfiles',
    'user.userProfiles.institution',
    'user.userProfiles.department',
    'groupChatMessage',
    'groupChatMessage.group',
    'groupChatMessage.group.createdBy',
    'groupChatMessage.group.createdBy.userProfiles',
  ];

  async sendReplyToGroupChatMessage(
    payload: SendGroupChatMessageReplyDTO,
  ): Promise<GroupChatMessageReplyResponseDTO> {
    try {
      checkForRequiredFields(
        ['type', 'content', 'senderId', 'groupChatMessageId'],
        payload,
      );
      compareEnumValueFields(payload.type, Object.values(MessageType), 'type');
      const createdReply = await this.create<Partial<GroupChatMessageReply>>(
        payload,
      );
      return {
        success: true,
        code: HttpStatus.CREATED,
        data: createdReply,
        message: 'Created',
      };
    } catch (ex) {
      this.logger.error(ex);
      throw ex;
    }
  }

  async findRepliesToGroupChatThread(
    groupChatMessageId: string,
    paginationPayload?: PaginationRequestType,
  ): Promise<GroupChatMessageRepliesResponseDTO> {
    try {
      if (!groupChatMessageId) {
        throw new BadRequestException('Field groupChatMessageId is required');
      }
      validateUUIDField(groupChatMessageId, 'groupChatMessageId');
      const options: FindManyOptions = {
        where: { groupChatMessageId },
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
          await calculatePaginationControls<GroupChatMessageReply>(
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
