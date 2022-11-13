import { UserInterest } from '@entities/user-interest.entity';
import {
  BadRequestException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { GenericService } from '@schematics/services/generic.service';
import { checkForRequiredFields } from '@utils/functions/utils.function';
import { BaseResponseTypeDTO } from '@utils/types/utils.types';
import {
  CreateUserInterestDTO,
  UserInterestResponseDTO,
  UserInterestsResponseDTO,
} from './dto/user-interest.dto';

@Injectable()
export class UserInterestService extends GenericService(UserInterest) {
  async createUserInterest(
    payload: CreateUserInterestDTO,
  ): Promise<UserInterestsResponseDTO> {
    try {
      const { interestIds, userId } = payload;
      if (!userId || !interestIds || interestIds.length <= 0) {
        throw new BadRequestException(
          'Fields userId, interestIds are required',
        );
      }
      const records = await this.createMany<Partial<UserInterest>>(
        interestIds.map((item) => ({ userId, interestId: item })),
      );
      return {
        success: true,
        code: HttpStatus.CREATED,
        data: records,
        message: 'Created',
      };
    } catch (ex) {
      this.logger.error(ex);
      throw ex;
    }
  }

  async findUserInterests(userId: string): Promise<UserInterestsResponseDTO> {
    try {
      if (!userId) {
        throw new BadRequestException('Field userId is required');
      }
      const records = await this.getRepo().find({
        where: { userId },
        relations: ['user', 'interest'],
      });
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

  async findUserInterestById(userInterestId): Promise<UserInterestResponseDTO> {
    try {
      if (!userInterestId) {
        throw new BadRequestException('Field userInterestId is required');
      }
      const record = await this.getRepo().findOne({
        where: { id: userInterestId },
        relations: ['user', 'interest'],
      });
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

  async updateUserInterests(
    payload: CreateUserInterestDTO,
  ): Promise<BaseResponseTypeDTO> {
    try {
      // Sort the ones that already exists remove
      checkForRequiredFields(['userId', 'interestIds'], payload);
      const { userId, interestIds } = payload;
      if (interestIds?.length > 0) {
        for (const interestId of interestIds) {
          const userInterests = await this.getRepo().findOne({
            where: [{ interestId }],
          });
          if (!userInterests?.id) {
            await this.create<Partial<UserInterest>>({ userId, interestId });
          }
        }
        return {
          code: HttpStatus.OK,
          message: 'Interests Updated',
          success: true,
        };
      }
      throw new NotFoundException('InterestIds are empty');
    } catch (ex) {}
  }
}
