import { UserFollowerBlacklist } from '@entities/user-follower-blacklist.entity';
import {
  BadRequestException,
  ConflictException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
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
  BlacklistUserFollowerDTO,
  UserFollowerBlacklistResponseDTO,
  UserFollowerBlacklistsResponseDTO,
} from './dto/user-follower-blacklist.dto';

@Injectable()
export class UserFollowerBlacklistService extends GenericService(
  UserFollowerBlacklist,
) {
  private relations = [
    'blacklistedUser',
    'blacklistedUser.userProfiles',
    'blacklistedUser.userProfiles.institution',
    'blacklistedUser.userProfiles.department',
  ];

  async blackListPotentialFollower(
    payload: BlacklistUserFollowerDTO,
    userId: string,
  ): Promise<UserFollowerBlacklistResponseDTO> {
    try {
      checkForRequiredFields(['blacklistedUserId'], payload);
      const record = await this.getRepo().findOne({
        where: { blacklistedUserId: payload.blacklistedUserId },
        select: ['id'],
      });
      if (record?.id) {
        throw new ConflictException(`You've already blacklisted this user`);
      }
      const createdRecord = await this.create<Partial<UserFollowerBlacklist>>({
        userId,
        blacklistedUserId: payload.blacklistedUserId,
      });
      return {
        success: true,
        code: HttpStatus.CREATED,
        message: 'Blacklisted',
        data: createdRecord,
      };
    } catch (ex) {
      this.logger.error(ex);
      throw ex;
    }
  }

  async findListOfMyBlacklistedUserFollowers(
    userId: string,
    payload?: PaginationRequestType,
  ): Promise<UserFollowerBlacklistsResponseDTO> {
    try {
      if (!userId) {
        throw new BadRequestException('Field userId is required');
      }
      if (payload?.pageNumber) {
        payload = {
          pageSize: parseInt(`${payload.pageSize}`),
          pageNumber: parseInt(`${payload.pageNumber}`),
        };

        const options: FindManyOptions = {
          take: payload.pageSize,
          skip: (payload.pageNumber - 1) * payload.pageSize,
          where: { userId },
          relations: this.relations,
        };
        const { response, paginationControl } =
          await calculatePaginationControls<UserFollowerBlacklist>(
            this.getRepo(),
            options,
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
      const records = await this.getRepo().find({
        where: { userId },
        relations: this.relations,
      });
      return {
        success: true,
        code: HttpStatus.OK,
        message: 'Records found',
        data: records,
      };
    } catch (ex) {
      this.logger.error(ex);
      throw ex;
    }
  }

  async deleteFollowersFromBlacklist(
    userId: string,
    blacklistedUserIds: string[],
  ): Promise<BaseResponseTypeDTO> {
    try {
      if (!userId || blacklistedUserIds?.length <= 0) {
        throw new BadRequestException(
          'Fields userId and blacklistedUserIds are required',
        );
      }
      const records = await this.getRepo().find({
        where: { blacklistedUserId: In(blacklistedUserIds) },
        select: ['userId', 'blacklistedUserId'],
      });
      const matched = records.every((item) => item.userId === userId);
      if (!matched) {
        const message = `Only account owner can remove user from blacklist`;
        throw new UnauthorizedException(message);
      }
      await this.delete({ userId, blacklistedUserId: In(blacklistedUserIds) });
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
