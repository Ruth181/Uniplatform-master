import { Group } from '@entities/group.entity';
import { GroupMemberService } from '@modules/group-member/group-member.service';
import { UserConnectionService } from '@modules/user-connection/user-connection.service';
import { UserService } from '@modules/user/user.service';
import {
  BadRequestException,
  ConflictException,
  forwardRef,
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { GenericService } from '@schematics/services/generic.service';
import {
  calculatePagination,
  calculatePaginationControls,
  checkForRequiredFields,
  sendEmail,
} from '@utils/functions/utils.function';
import {
  BaseResponseTypeDTO,
  PaginationRequestType,
} from '@utils/types/utils.types';
import { FindManyOptions, In, Not } from 'typeorm';
import {
  CreateGroupDTO,
  GroupResponseDTO,
  GroupsResponseDTO,
  UpdateGroupDTO,
} from './dto/group.dto';

@Injectable()
export class GroupService extends GenericService(Group) {
  private relations = [
    'membersForThisGroup',
    'membersForThisGroup.user',
    'requestsToJoinThisGroup',
    'requestsToJoinThisGroup.user',
  ];

  constructor(
    private readonly userSrv: UserService,
    private readonly userConnectionSrv: UserConnectionService,
    @Inject(forwardRef(() => GroupMemberService))
    private readonly groupMemberSrv: GroupMemberService,
  ) {
    super();
  }

  async createGroup(
    payload: CreateGroupDTO,
    userId: string,
  ): Promise<GroupResponseDTO> {
    try {
      checkForRequiredFields(['groupBio', 'name', 'groupPhoto'], payload);
      const recordExists = await this.getRepo().findOne({
        where: { name: payload.name.toUpperCase() },
        select: ['id'],
      });
      if (recordExists?.id) {
        throw new ConflictException('Group with similar name exists');
      }
      const newGroup = await this.create<Partial<Group>>({
        ...payload,
        userId,
      });
      if (newGroup?.id && payload?.peopleToInvite?.length > 0) {
        await this.sendInvitesToJoinGroup(
          newGroup.id,
          // Remove Id of currently logged in user
          payload.peopleToInvite.filter((item) => item !== userId),
        );
      }
      return {
        success: true,
        code: HttpStatus.CREATED,
        data: newGroup,
        message: 'Created',
      };
    } catch (ex) {
      this.logger.error(ex);
      throw ex;
    }
  }

  async findGroups(
    status = true,
    paginationPayload?: PaginationRequestType,
  ): Promise<GroupsResponseDTO> {
    try {
      const options: FindManyOptions = {
        where: { status },
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
          await calculatePaginationControls<Group>(
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

  async findSuggestedGroups(
    userId: string,
    paginationPayload?: PaginationRequestType,
  ): Promise<GroupsResponseDTO> {
    try {
      if (!userId) {
        throw new BadRequestException('Field userId is required');
      }
      const groupsUserBelongsTo = await this.groupMemberSrv.getRepo().find({
        where: { userId, status: true },
        select: ['groupId'],
      });
      let groups = await this.getRepo().find({
        where: {
          id: Not(In(groupsUserBelongsTo.map(({ groupId }) => groupId))),
        },
        relations: this.relations,
      });
      const userConnections = await this.userConnectionSrv.getRepo().find({
        where: { userId },
        select: ['id', 'connectedToUserId'],
      });
      const userConnectionIds = userConnections.map(
        ({ connectedToUserId }) => connectedToUserId,
      );
      // Make sure the groups were created by user that are connected to logged in user
      groups = groups.filter((group) => {
        userConnectionIds.includes(group.userId);
      });
      if (paginationPayload?.pageNumber) {
        paginationPayload = {
          pageSize: parseInt(`${paginationPayload.pageSize}`),
          pageNumber: parseInt(`${paginationPayload.pageNumber}`),
        };
        const { response, paginationControl } = calculatePagination(
          groups,
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
      return {
        success: true,
        code: HttpStatus.OK,
        data: groups,
        message: 'Records found',
      };
    } catch (ex) {
      this.logger.error(ex);
      throw ex;
    }
  }

  async updateGroup(payload: UpdateGroupDTO): Promise<BaseResponseTypeDTO> {
    try {
      checkForRequiredFields(['groupId'], payload);
      const record = await this.findOne({ id: payload.groupId });
      if (!record?.id) {
        throw new NotFoundException('Group not found');
      }
      if ('status' in payload) {
        record.status = payload.status;
      }
      if ('isPrivate' in payload) {
        record.isPrivate = payload.isPrivate;
      }
      if (payload.name) {
        const nameToUppercase = payload.name.toUpperCase();
        if (record.name !== nameToUppercase) {
          const nameRecord = await this.getRepo().findOne({
            where: { name: nameToUppercase },
            select: ['id'],
          });
          if (nameRecord?.id) {
            throw new ConflictException(
              'Group with similar name already exists',
            );
          }
          record.name = nameToUppercase;
        }
      }
      if (payload.groupBio && record.groupBio !== payload.groupBio) {
        record.groupBio = payload.groupBio;
      }
      if (payload.groupPhoto && record.groupPhoto !== payload.groupPhoto) {
        record.groupPhoto = payload.groupPhoto;
      }
      const updatedRecord: Partial<Group> = {
        groupBio: record.groupBio,
        groupPhoto: record.groupPhoto,
        name: record.name,
        isPrivate: record.isPrivate,
        status: record.status,
      };
      await this.getRepo().update({ id: record.id }, updatedRecord);
      return {
        success: true,
        code: HttpStatus.OK,
        message: 'Updated',
      };
    } catch (ex) {
      this.logger.error(ex);
      throw ex;
    }
  }

  async findGroupById(groupId: string): Promise<GroupResponseDTO> {
    try {
      if (!groupId) {
        throw new BadRequestException('Field groupId is required');
      }
      const record = await this.getRepo().findOne({
        where: { id: groupId },
        relations: this.relations,
      });
      if (!record?.id) {
        throw new NotFoundException('Group not found');
      }
      return {
        success: true,
        code: HttpStatus.OK,
        data: record,
        message: 'Record found',
      };
    } catch (ex) {
      this.logger.error(ex);
      throw ex;
    }
  }

  private async sendInvitesToJoinGroup(
    groupId: string,
    usersToInvite: string[],
  ): Promise<void> {
    try {
      const group = await this.getRepo().findOne({
        where: { id: groupId },
        relations: ['createdBy', 'createdBy.userProfiles'],
      });
      const fullName = `${group.createdBy.userProfiles[0].firstName} ${group.createdBy.userProfiles[0].lastName}`;
      const html = `<h1>${fullName} is inviting you to Join ${group.name}</h1>`;

      const users = await this.userSrv.getRepo().find({
        where: { id: In(usersToInvite) },
      });
      await sendEmail(
        html,
        'Group Invite',
        users.map(({ email }) => email),
      );
    } catch (ex) {
      this.logger.error(ex);
      throw ex;
    }
  }
}
