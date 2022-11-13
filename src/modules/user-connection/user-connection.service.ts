import {
  Injectable,
  BadRequestException,
  ConflictException,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';
import { GenericService } from '@schematics/services/generic.service';
import { UserConnection } from '@entities/user-connection.entity';
import {
  calculatePagination,
  calculatePaginationControls,
  checkForRequiredFields,
  validateUUIDField,
} from '@utils/functions/utils.function';
import {
  CreateUserConnectionDTO,
  UserConnectionResponseDTO,
} from './dto/user-connection.dto';
import { UserProfileService } from '@modules/user-profile/user-profile.service';
import { UsersResponseDTO } from '@modules/user/dto/user.dto';
import { User } from '@entities/user.entity';
import { PaginationRequestType } from '@utils/types/utils.types';
import { UserFollowerService } from '@modules/user-follower/user-follower.service';
import { Brackets, FindManyOptions, Not } from 'typeorm';
import { UserConnectionBlacklistService } from '@modules/user-connection-blacklist/user-connection-blacklist.service';

@Injectable()
export class UserConnectionService extends GenericService(UserConnection) {
  constructor(
    private readonly userProfileSrv: UserProfileService,
    private readonly userFollowerSrv: UserFollowerService,
    private readonly userConnectionBlacklistSrv: UserConnectionBlacklistService,
  ) {
    super();
  }

  async createConnection(
    payload: CreateUserConnectionDTO,
    userId: string,
  ): Promise<UserConnectionResponseDTO> {
    try {
      checkForRequiredFields(['userId'], payload);
      if (payload.userId === userId) {
        throw new BadRequestException('User cannot connect to themselves');
      }
      const recordExist = await this.findOne({
        connectedToUserId: payload.userId,
        userId,
      });
      if (recordExist?.id) {
        throw new ConflictException(
          'User has already connected to this person',
        );
      }
      const createdRecord = await this.create<Partial<UserConnection>>({
        connectedToUserId: payload.userId,
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

  async findMyExistingConnections(
    userId: string,
    payload?: PaginationRequestType,
  ): Promise<UsersResponseDTO> {
    try {
      if (!userId) {
        throw new BadRequestException('Field userId is required');
      }
      const relations = [
        'connectedToUser',
        'connectedToUser.userProfiles',
        'connectedToUser.userProfiles.institution',
        'connectedToUser.userProfiles.department',
      ];
      if (payload?.pageNumber) {
        payload = {
          pageSize: parseInt(`${payload.pageSize}`),
          pageNumber: parseInt(`${payload.pageNumber}`),
        };
        const options: FindManyOptions = {
          where: { userId },
          order: { dateCreated: 'DESC' },
          relations,
          take: payload.pageSize,
          skip: (payload.pageNumber - 1) * payload.pageSize,
        };
        const { response, paginationControl } =
          await calculatePaginationControls<UserConnection>(
            this.getRepo(),
            options,
            payload,
          );
        return {
          success: true,
          message: 'Records found',
          code: HttpStatus.OK,
          data: response.map(({ connectedToUser }) => connectedToUser),
          paginationControl: paginationControl,
        };
      }
      const records = await this.getRepo().find({
        where: { userId },
        order: { dateCreated: 'DESC' },
        relations,
      });
      return {
        success: true,
        data: records.map(({ connectedToUser }) => connectedToUser),
        code: HttpStatus.OK,
        message: 'Records found',
      };
    } catch (ex) {
      this.logger.error(ex);
      throw ex;
    }
  }

  async searchMyExistingConnections(
    userId: string,
    searchTerm: string,
    payload?: PaginationRequestType,
  ): Promise<UsersResponseDTO> {
    try {
      if (!userId) {
        throw new BadRequestException('Field userId is required');
      }
      const query = this.getRepo()
        .createQueryBuilder('UC')
        .leftJoinAndSelect('UC.connectedToUser', 'connectedToUser')
        .leftJoinAndSelect('connectedToUser.userProfiles', 'userProfiles')
        .leftJoinAndSelect('userProfiles.institution', 'institution')
        .leftJoinAndSelect('userProfiles.department', 'department')
        .where(
          new Brackets((qb) => {
            qb.where('UC.userId =:userId', { userId }).andWhere(
              'userProfiles.firstName iLIKE :searchTerm',
              {
                searchTerm,
              },
            );
          }),
        )
        .orWhere(
          new Brackets((qb) => {
            qb.where('UC.userId =:userId', { userId }).andWhere(
              'userProfiles.lastName iLIKE :searchTerm',
              {
                searchTerm,
              },
            );
          }),
        )
        .orderBy({ 'UC.dateCreated': 'DESC' });
      if (payload?.pageNumber) {
        payload = {
          pageSize: parseInt(`${payload.pageSize}`),
          pageNumber: parseInt(`${payload.pageNumber}`),
        };
        const records = await query
          .take(payload.pageSize)
          .skip((payload.pageNumber - 1) * payload.pageSize)
          .getMany();
        const { response, paginationControl } = calculatePagination(
          records,
          payload,
        );
        return {
          success: true,
          data: response.map(({ connectedToUser }) => connectedToUser),
          code: HttpStatus.OK,
          message: 'Records found',
          paginationControl,
        };
      }
      const records = await query.getMany();
      return {
        success: true,
        data: records.map(({ connectedToUser }) => connectedToUser),
        code: HttpStatus.OK,
        message: 'Records found',
      };
    } catch (ex) {
      this.logger.error(ex);
      throw ex;
    }
  }

  async findAvailableConnections(
    userId: string,
    payload?: PaginationRequestType,
  ): Promise<UsersResponseDTO> {
    try {
      if (!userId) {
        throw new BadRequestException('Field userId is required');
      }
      validateUUIDField(userId, 'userId');
      const userRecord = await this.userProfileSrv.getRepo().findOne({
        where: { userId },
        relations: ['user'],
      });
      if (!userRecord?.id) {
        throw new NotFoundException('User profile data not set');
      }
      const usersInSameDepartment = await this.userProfileSrv.getRepo().find({
        where: { departmentId: userRecord.departmentId, userId: Not(userId) },
        relations: [
          'user',
          'user.userProfiles',
          'user.userProfiles.institution',
          'user.userProfiles.department',
          'user.userSettings',
          'user.connectedToUserRecords',
          'user.connectedToUserRecords.user',
          'user.connectedToUserRecords.user.userProfiles',
        ],
      });
      // Find others who are not already connections
      const userNotConnectedTo: User[] = [];
      for (const item of usersInSameDepartment) {
        const recordExist = await this.getRepo().findOne({
          where: { connectedToUserId: item.userId, userId },
          select: ['id'],
        });
        // Check if user has been blacklisted
        const blacklistRecord = await this.userConnectionBlacklistSrv
          .getRepo()
          .findOne({
            where: { userId, blacklistedUserId: item.userId },
            select: ['id'],
          });
        if (!recordExist?.id && !blacklistRecord?.id) {
          userNotConnectedTo.push(item.user);
        }
      }
      if (payload?.pageNumber) {
        payload = {
          pageSize: parseInt(`${payload.pageSize}`),
          pageNumber: parseInt(`${payload.pageNumber}`),
        };
        const { response, paginationControl } = calculatePagination(
          userNotConnectedTo,
          payload,
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
        data: userNotConnectedTo,
        message: 'Records found',
      };
    } catch (ex) {
      this.logger.error(ex);
      throw ex;
    }
  }

  async findAvailableFriends(
    userId: string,
    payload?: PaginationRequestType,
  ): Promise<UsersResponseDTO> {
    try {
      const userList: User[] = [];
      const availableConnections = await this.findAvailableConnections(userId);
      if (availableConnections?.success) {
        // [Find users who are followers]
        for (const item of availableConnections.data) {
          const recordExist = await this.userFollowerSrv.getRepo().findOne({
            where: { userId, followUserId: item.id },
            select: ['id'],
          });
          if (recordExist?.id) {
            userList.push(item);
          }
        }
      } else {
        userList.push(...availableConnections.data);
      }
      if (payload?.pageNumber) {
        payload = {
          pageSize: parseInt(`${payload.pageSize}`),
          pageNumber: parseInt(`${payload.pageNumber}`),
        };
        const { response, paginationControl } = calculatePagination(
          userList,
          payload,
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
        data: userList,
        message: 'Records found',
      };
    } catch (ex) {
      this.logger.error(ex);
      throw ex;
    }
  }
}
