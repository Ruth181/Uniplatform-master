import { GroupChatMessage } from '@entities/group-chat-message.entity';
import { GroupMemberService } from '@modules/group-member/group-member.service';
import {
  BadRequestException,
  ForbiddenException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { GenericService } from '@schematics/services/generic.service';
import {
  calculatePaginationControls,
  checkForRequiredFields,
  compareEnumValueFields,
} from '@utils/functions/utils.function';
import { MessageType } from '@utils/types/utils.constant';
import { PaginationRequestType } from '@utils/types/utils.types';
import { FindManyOptions } from 'typeorm';
import {
  GroupChatFilterTypeDTO,
  GroupChatMessageResponseDTO,
  GroupChatMessagesResponseDTO,
  SendGroupChatMessageDTO,
} from './dto/group-chat.dto';

@Injectable()
export class GroupChatMessageService extends GenericService(GroupChatMessage) {
  private relations = [
    'group',
    'user',
    'user.userProfiles',
    'user.userProfiles.department',
    'user.userProfiles.institution',
    'repliesToThisMessage',
  ];

  constructor(private readonly groupMemberSrv: GroupMemberService) {
    super();
  }

  async sendGroupMessage(
    payload: SendGroupChatMessageDTO,
  ): Promise<GroupChatMessageResponseDTO> {
    try {
      checkForRequiredFields(
        ['groupId', 'content', 'type', 'senderId'],
        payload,
      );
      compareEnumValueFields(payload.type, Object.values(MessageType), 'type');
      const groupMemberRecord = await this.groupMemberSrv.getRepo().findOne({
        where: { groupId: payload.groupId, userId: payload.senderId },
        select: ['id'],
      });
      if (!groupMemberRecord?.id) {
        throw new ForbiddenException('Sender is not part of this group');
      }
      const createdMessage = await this.create<Partial<GroupChatMessage>>(
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

  async findGroupMessageThread(
    groupId: string,
    paginationPayload?: PaginationRequestType,
  ): Promise<GroupChatMessagesResponseDTO> {
    try {
      if (!groupId) {
        throw new BadRequestException('Field groupId is required');
      }
      const options: FindManyOptions = {
        where: { groupId },
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
          await calculatePaginationControls<GroupChatMessage>(
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

  async filterGroupMessagesByType(
    payload: GroupChatFilterTypeDTO,
    paginationPayload?: PaginationRequestType,
  ): Promise<GroupChatMessagesResponseDTO> {
    try {
      checkForRequiredFields(['type', 'groupId'], payload);
      const options: FindManyOptions = {
        where: { groupId: payload.groupId, type: payload.type },
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
          await calculatePaginationControls<GroupChatMessage>(
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
