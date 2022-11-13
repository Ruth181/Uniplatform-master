import { GroupMember } from '@entities/group-member.entity';
import { Group } from '@entities/group.entity';
import { GroupsResponseDTO } from '@modules/group/dto/group.dto';
import { GroupService } from '@modules/group/group.service';
import {
  BadRequestException,
  ForbiddenException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { GenericService } from '@schematics/services/generic.service';
import {
  calculatePagination,
  calculatePaginationControls,
  checkForRequiredFields,
} from '@utils/functions/utils.function';
import { PaginationRequestType } from '@utils/types/utils.types';
import { FindManyOptions } from 'typeorm';
import {
  CreateGroupMemberDTO,
  GroupMemberResponseDTO,
} from './dto/group-member.dto';

@Injectable()
export class GroupMemberService extends GenericService(GroupMember) {
  private relations = [
    'group',
    'group.createdBy',
    'group.membersForThisGroup',
    'group.membersForThisGroup.user',
    'group.membersForThisGroup.user.userProfiles',
  ];

  constructor(private readonly groupSrv: GroupService) {
    super();
  }

  async joinGroup(
    payload: CreateGroupMemberDTO,
    userId: string,
  ): Promise<GroupMemberResponseDTO> {
    try {
      checkForRequiredFields(['groupId'], payload);
      const groupRecord = await this.groupSrv.findGroupById(payload.groupId);
      if (groupRecord.data.isPrivate) {
        throw new ForbiddenException(
          'Cannot join private group without invite',
        );
      }
      const recordExists = await this.getRepo().findOne({
        where: { userId, groupId: payload.groupId },
      });
      if (recordExists?.id) {
        if (recordExists.status === false) {
          await this.getRepo().update(
            { id: recordExists.id },
            { status: true },
          );
          recordExists.status = true;
        }
        return {
          success: true,
          code: HttpStatus.CREATED,
          data: recordExists,
          message: 'Created',
        };
      }
      const createdRecord = await this.create<Partial<GroupMember>>({
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

  async searchForMyGroups(
    searchTerm: string,
    userId: string,
    paginationPayload?: PaginationRequestType,
  ): Promise<GroupsResponseDTO> {
    try {
      if (!searchTerm) {
        throw new BadRequestException('Field searchTerm is required');
      }
      const regExp = new RegExp(searchTerm, 'ig');
      const records = await this.findMyGroups(userId);
      const searchResults = records.data.filter((item) => {
        return regExp.test(item.groupBio) || regExp.test(item.name);
      });
      if (paginationPayload?.pageNumber) {
        const { response, paginationControl } =
          await calculatePagination<Group>(searchResults, paginationPayload);
        return {
          success: true,
          code: HttpStatus.OK,
          data: response,
          message: 'Records found',
          paginationControl,
        };
      }
      return {
        success: true,
        code: HttpStatus.OK,
        data: searchResults,
        message: 'Records found',
      };
    } catch (ex) {
      this.logger.error(ex);
      throw ex;
    }
  }

  async findMyGroups(
    userId: string,
    paginationPayload?: PaginationRequestType,
  ): Promise<GroupsResponseDTO> {
    try {
      if (!userId) {
        throw new BadRequestException('Field userId is required');
      }
      const options: FindManyOptions = {
        where: { userId, status: true },
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
          await calculatePaginationControls<GroupMember>(
            this.getRepo(),
            options,
            paginationPayload,
          );
        return {
          success: true,
          message: 'Records found',
          code: HttpStatus.OK,
          data: response.map(({ group }) => group),
          paginationControl: paginationControl,
        };
      }
      const records = await this.getRepo().find(options);
      return {
        success: true,
        code: HttpStatus.OK,
        data: records.map(({ group }) => group),
        message: 'Records found',
      };
    } catch (ex) {
      this.logger.error(ex);
      throw ex;
    }
  }
}
