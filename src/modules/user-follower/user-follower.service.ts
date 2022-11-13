import { UserFollower } from '@entities/user-follower.entity';
import { UsersResponseDTO } from '@modules/user/dto/user.dto';
import {
  BadRequestException,
  ConflictException,
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
import { Brackets, FindManyOptions } from 'typeorm';
import {
  CreateUserFollowerDTO,
  UserFollowerResponseDTO,
} from './dto/user-follower.dto';

@Injectable()
export class UserFollowerService extends GenericService(UserFollower) {
  async createFollower(
    payload: CreateUserFollowerDTO,
    userId: string,
  ): Promise<UserFollowerResponseDTO> {
    try {
      checkForRequiredFields(['userId'], payload);
      if (payload.userId === userId) {
        throw new BadRequestException('User cannot connect to themselves');
      }
      const recordExist = await this.findOne({
        followUserId: payload.userId,
        userId,
      });
      if (recordExist?.id) {
        throw new ConflictException('User has already followed this person');
      }
      const createdRecord = await this.create<Partial<UserFollower>>({
        followUserId: payload.userId,
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

  async findMyExistingFollowers(
    userId: string,
    payload?: PaginationRequestType,
  ): Promise<UsersResponseDTO> {
    try {
      if (!userId) {
        throw new BadRequestException('Field userId is required');
      }
      const relations = [
        'followUser',
        'followUser.userProfiles',
        'followUser.userProfiles.institution',
        'followUser.userProfiles.department',
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
          await calculatePaginationControls<UserFollower>(
            this.getRepo(),
            options,
            payload,
          );
        return {
          success: true,
          message: 'Records found',
          code: HttpStatus.OK,
          data: response.map(({ followUser }) => followUser),
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
        data: records.map(({ followUser }) => followUser),
        code: HttpStatus.OK,
        message: 'Records found',
      };
    } catch (ex) {
      this.logger.error(ex);
      throw ex;
    }
  }

  async searchMyExistingFollowers(
    userId: string,
    searchTerm: string,
    payload?: PaginationRequestType,
  ): Promise<UsersResponseDTO> {
    try {
      if (!userId) {
        throw new BadRequestException('Field userId is required');
      }
      const query = this.getRepo()
        .createQueryBuilder('UF')
        .leftJoinAndSelect('UF.followUser', 'followUser')
        .leftJoinAndSelect('followUser.userProfiles', 'userProfiles')
        .leftJoinAndSelect('userProfiles.institution', 'institution')
        .leftJoinAndSelect('userProfiles.department', 'department')
        .where(
          new Brackets((qb) => {
            qb.where('UF.userId =:userId', { userId }).andWhere(
              'userProfiles.firstName iLIKE :searchTerm',
              {
                searchTerm,
              },
            );
          }),
        )
        .orWhere(
          new Brackets((qb) => {
            qb.where('UF.userId =:userId', { userId }).andWhere(
              'userProfiles.lastName iLIKE :searchTerm',
              { searchTerm },
            );
          }),
        )
        .orderBy({ 'UF.dateCreated': 'DESC' });
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
          data: response.map(({ followUser }) => followUser),
          code: HttpStatus.OK,
          message: 'Records found',
          paginationControl,
        };
      }
      const records = await query.getMany();
      return {
        success: true,
        data: records.map(({ followUser }) => followUser),
        code: HttpStatus.OK,
        message: 'Records found',
      };
    } catch (ex) {
      this.logger.error(ex);
      throw ex;
    }
  }
}
