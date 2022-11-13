import { UserProfile } from '@entities/user-profile.entity';
import { UpdateUserDTO } from '@modules/user/dto/user.dto';
import {
  BadRequestException,
  ConflictException,
  HttpStatus,
  Injectable,
  NotFoundException,
  NotImplementedException,
} from '@nestjs/common';
import { GenericService } from '@schematics/services/generic.service';
import {
  checkForRequiredFields,
  compareEnumValueFields,
  validateUUIDField,
} from '@utils/functions/utils.function';
import {
  EducationalCategory,
  EducationalLevel,
} from '@utils/types/utils.constant';
import { BaseResponseTypeDTO } from '@utils/types/utils.types';
import {
  CreateUserProfileDTO,
  UserProfileResponseDTO,
} from './dto/user-profile.dto';

@Injectable()
export class UserProfileService extends GenericService(UserProfile) {
  async createUserProfile(
    payload: CreateUserProfileDTO,
    userId: string,
  ): Promise<UserProfileResponseDTO> {
    try {
      if (!userId) {
        throw new BadRequestException('userId is Required');
      }
      const userExists = await this.getRepo().findOne({ where: [{ userId }] });
      if (userExists) {
        throw new ConflictException('User Profile Already Exists');
      }
      checkForRequiredFields(
        [
          'firstName',
          'lastName',
          'dateOfBirth',
          'idCardName',
          'idCardNumber',
          'idCard',
          'dateIssued',
          'departmentId',
          'institutionId',
        ],
        payload,
      );
      const newPayload: Partial<UserProfile> = {
        firstName: payload.firstName,
        lastName: payload.lastName,
        dateOfBirth: new Date(payload.dateOfBirth),
        idCardName: payload.idCardName,
        idCardNumber: payload.idCardNumber,
        idCard: payload.idCard,
        dateIssued: new Date(payload.dateIssued),
        category: payload.category,
        level: payload.level,
        departmentId: payload.departmentId,
        institutionId: payload.institutionId,
      };
      const createdProfile: UserProfile = await this.create<
        Partial<UserProfile>
      >({
        userId,
        ...newPayload,
      });
      if (!createdProfile) {
        throw new NotImplementedException();
      }
      return {
        code: HttpStatus.CREATED,
        data: createdProfile,
        message: 'PROFILE CREATED',
        success: true,
      };
    } catch (ex) {
      throw ex;
    }
  }

  async findDepartmentCount(departmentId: string): Promise<number> {
    try {
      if (!departmentId) {
        const message = `Field 'departmentId' is required`;
        throw new BadRequestException(message);
      }
      return this.getRepo().count({
        where: { departmentId },
      });
    } catch (ex) {
      this.logger.error(ex);
      throw ex;
    }
  }

  async updateProfile(
    payload: Partial<UpdateUserDTO>,
    userProfileId: string,
  ): Promise<BaseResponseTypeDTO> {
    try {
      if (!userProfileId) {
        throw new BadRequestException('Field userProfileId is required');
      }
      const {
        firstName,
        lastName,
        departmentId,
        institutionId,
        dateOfBirth,
        idCardName,
        idCardNumber,
        idCard,
        dateIssued,
        category,
        level,
      } = payload;
      const findUserProfile = await this.getRepo().findOne({
        where: [{ id: userProfileId }],
      });
      if (!findUserProfile) {
        throw new NotFoundException('User Profile Not Found');
      }
      if (departmentId && findUserProfile.departmentId !== departmentId) {
        validateUUIDField(departmentId, 'departmentId');
        findUserProfile.departmentId = departmentId;
      }
      if (institutionId && findUserProfile.institutionId !== institutionId) {
        validateUUIDField(institutionId, 'institutionId');
        findUserProfile.institutionId = institutionId;
      }
      if ('status' in payload) {
        findUserProfile.status = payload.status;
      }
      if (firstName && findUserProfile.firstName !== firstName) {
        findUserProfile.firstName = firstName;
      }
      if (lastName && findUserProfile.lastName !== lastName) {
        findUserProfile.lastName = lastName;
      }
      if (
        dateOfBirth &&
        findUserProfile.dateOfBirth !== new Date(dateOfBirth)
      ) {
        findUserProfile.dateOfBirth = new Date(dateOfBirth);
      }
      if (idCardName && findUserProfile.idCardName !== idCardName) {
        findUserProfile.idCardName = idCardName;
      }
      if (idCardNumber && findUserProfile.idCardNumber !== idCardNumber) {
        findUserProfile.idCardNumber = idCardNumber;
      }
      if (idCard && findUserProfile.idCard !== idCard) {
        findUserProfile.idCard = idCard;
      }
      if (dateIssued && findUserProfile.dateIssued !== new Date(dateIssued)) {
        findUserProfile.dateIssued = new Date(dateIssued);
      }
      if (category && findUserProfile.category !== category) {
        compareEnumValueFields(
          category,
          Object.values(EducationalCategory),
          'category',
        );
        findUserProfile.category = category;
      }
      if (level && findUserProfile.level !== level) {
        compareEnumValueFields(level, Object.values(EducationalLevel), 'level');
        findUserProfile.level = level;
      }
      const updatedProfile: Partial<UserProfile> = {
        firstName: findUserProfile.firstName,
        lastName: findUserProfile.lastName,
        dateOfBirth: findUserProfile.dateOfBirth,
        idCardName: findUserProfile.idCardName,
        idCardNumber: findUserProfile.idCardNumber,
        idCard: findUserProfile.idCard,
        dateIssued: findUserProfile.dateIssued,
        category: findUserProfile.category,
        institutionId: findUserProfile.institutionId,
        departmentId: findUserProfile.departmentId,
        level: findUserProfile.level,
      };
      await this.getRepo().update({ id: userProfileId }, updatedProfile);
      return {
        code: HttpStatus.OK,
        message: 'Profile Updated',
        success: true,
      };
    } catch (ex) {
      throw ex;
    }
  }

  async findByUserProfileById(
    userProfileId: string,
  ): Promise<UserProfileResponseDTO> {
    try {
      if (!userProfileId) {
        throw new BadRequestException('userProfileId is Required');
      }
      const userProfile: UserProfile = await this.getRepo().findOne({
        where: [{ id: userProfileId }],
      });
      if (!userProfile) {
        throw new NotFoundException('PROFILE NOT FOUND');
      }
      return {
        code: HttpStatus.OK,
        data: userProfile,
        message: 'REQUEST SUCCESSFUL',
        success: true,
      };
    } catch (ex) {
      throw ex;
    }
  }

  async findByUserProfileByUserId(
    userId: string,
  ): Promise<UserProfileResponseDTO> {
    try {
      if (!userId) {
        throw new BadRequestException('userId is Required');
      }
      const userProfile: UserProfile = await this.getRepo().findOne({
        where: [{ userId }],
      });
      if (!userProfile) {
        throw new NotFoundException('PROFILE NOT FOUND');
      }
      return {
        code: HttpStatus.OK,
        data: userProfile,
        message: 'REQUEST SUCCESSFUL',
        success: true,
      };
    } catch (ex) {
      throw ex;
    }
  }
}
