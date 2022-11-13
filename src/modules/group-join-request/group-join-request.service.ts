import { GroupJoinRequest } from '@entities/group-join-request.entity';
import { GroupMember } from '@entities/group-member.entity';
import { GroupMemberService } from '@modules/group-member/group-member.service';
import {
  BadRequestException,
  ConflictException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { GenericService } from '@schematics/services/generic.service';
import {
  calculatePaginationControls,
  checkForRequiredFields,
} from '@utils/functions/utils.function';
import {
  BaseResponseTypeDTO,
  PaginationRequestType,
} from '@utils/types/utils.types';
import { FindManyOptions, In } from 'typeorm';
import {
  CreateJoinGroupRequestDTO,
  GroupJoinRequestResponseDTO,
  GroupJoinRequestsResponseDTO,
} from './dto/group-join-request.dto';

@Injectable()
export class GroupJoinRequestService extends GenericService(GroupJoinRequest) {
  private relations = ['user', 'user.userProfiles'];

  constructor(private readonly groupMemberSrv: GroupMemberService) {
    super();
  }

  async makeRequestToJoinGroup(
    payload: CreateJoinGroupRequestDTO,
    userId: string,
  ): Promise<GroupJoinRequestResponseDTO> {
    try {
      checkForRequiredFields(['groupId'], payload);
      const groupMemberRecord = await this.groupMemberSrv.getRepo().findOne({
        where: { userId, groupId: payload.groupId },
        select: ['id'],
      });
      if (groupMemberRecord?.id) {
        throw new ConflictException('You are already a member of this group');
      }
      const recordExists = await this.getRepo().findOne({
        where: { userId, groupId: payload.groupId },
        select: ['id'],
      });
      if (recordExists?.id) {
        throw new ConflictException(
          "You've already requested to join this group",
        );
      }
      const createdRecord = await this.create<Partial<GroupJoinRequest>>({
        ...payload,
        userId,
      });
      return {
        success: true,
        code: HttpStatus.CREATED,
        data: createdRecord,
        message: 'Created',
      };
    } catch (ex) {
      this.logger.error(ex);
      throw ex;
    }
  }

  async findJoinRequestListByGroupId(
    groupId: string,
    paginationPayload?: PaginationRequestType,
  ): Promise<GroupJoinRequestsResponseDTO> {
    try {
      if (!groupId) {
        throw new BadRequestException('Field groupId is required');
      }
      const options: FindManyOptions = {
        where: { groupId, status: true },
        order: { dateCreated: 'DESC' },
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
          await calculatePaginationControls<GroupJoinRequest>(
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

  async acceptGroupRequests(
    groupInviteIds: string[],
  ): Promise<BaseResponseTypeDTO> {
    try {
      if (groupInviteIds?.length <= 0) {
        throw new BadRequestException('Field groupInviteIds is required');
      }
      const groupInviteRecords = await this.getRepo().find({
        where: { id: In(groupInviteIds) },
      });
      for (const invite of groupInviteRecords) {
        const record = await this.groupMemberSrv.getRepo().findOne({
          where: { userId: invite.userId, groupId: invite.groupId },
        });
        if (!record?.id) {
          await this.groupMemberSrv.create<Partial<GroupMember>>({
            userId: invite.userId,
            groupId: invite.groupId,
          });
        }
        await this.delete({ id: invite.id });
      }
      return {
        success: true,
        code: HttpStatus.OK,
        message: 'Requests accepted',
      };
    } catch (ex) {
      this.logger.error(ex);
      throw ex;
    }
  }

  async rejectGroupJoinRequest(
    groupInviteIds: string[],
  ): Promise<BaseResponseTypeDTO> {
    try {
      if (groupInviteIds?.length <= 0) {
        throw new BadRequestException('Field groupInviteIds is required');
      }
      await this.delete({ id: In(groupInviteIds) });
      return {
        success: true,
        code: HttpStatus.OK,
        message: 'Deleted',
      };
    } catch (ex) {
      this.logger.error(ex);
      throw ex;
    }
  }
}
