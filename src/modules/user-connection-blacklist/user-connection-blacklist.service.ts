import { UserConnectionBlacklist } from '@entities/user-connection-blacklist.entity';
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
  BlacklistUserConnectionDTO,
  UserConnectionBlacklistResponseDTO,
  UserConnectionBlacklistsResponseDTO,
} from './dto/user-connection-blacklist.dto';

@Injectable()
export class UserConnectionBlacklistService extends GenericService(
  UserConnectionBlacklist,
) {
  private relations = [
    'blacklistedUser',
    'blacklistedUser.userProfiles',
    'blacklistedUser.userProfiles.institution',
    'blacklistedUser.userProfiles.department',
  ];

  async blackListPotentialConnection(
    payload: BlacklistUserConnectionDTO,
    userId: string,
  ): Promise<UserConnectionBlacklistResponseDTO> {
    try {
      checkForRequiredFields(['blacklistedUserId'], payload);
      const record = await this.getRepo().findOne({
        where: { blacklistedUserId: payload.blacklistedUserId },
        select: ['id'],
      });
      if (record?.id) {
        throw new ConflictException(`You've already blacklisted this user`);
      }
      const createdRecord = await this.create<Partial<UserConnectionBlacklist>>(
        {
          userId,
          blacklistedUserId: payload.blacklistedUserId,
        },
      );
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

  async findListOfMyBlacklistedUserConnections(
    userId: string,
    payload?: PaginationRequestType,
  ): Promise<UserConnectionBlacklistsResponseDTO> {
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
          await calculatePaginationControls<UserConnectionBlacklist>(
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

  async deleteConnectionsFromBlacklist(
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
