import {
  Injectable,
  forwardRef,
  Inject,
  BadRequestException,
  ConflictException,
  ForbiddenException,
  HttpStatus,
  InternalServerErrorException,
  NotFoundException,
  NotImplementedException,
} from '@nestjs/common';
import {
  arrayIncludesAny,
  calculatePagination,
  calculatePaginationControls,
  checkForRequiredFields,
  compareEnumValueFields,
  generateUniqueCode,
  hashPassword,
  sendEmail,
  validateEmailField,
  verifyPasswordHash,
} from '@utils/functions/utils.function';
import { User } from '@entities/user.entity';
import { GenericService } from '@schematics/services/generic.service';
import { AppRole, EducationalLevel } from '@utils/types/utils.constant';
import {
  BaseResponseTypeDTO,
  PaginationRequestType,
} from '@utils/types/utils.types';
import {
  ChangePasswordDTO,
  CreateStudentDTO,
  UpdatePasswordDTO,
  UpdateUserAccountInfoDTO,
  UpdateUserDTO,
  UserResponseDTO,
  UsersResponseDTO,
  UserProfileSummaryCountDTO,
  CreateLecturerDTO,
} from './dto/user.dto';
import { UserProfileService } from '@modules/user-profile/user-profile.service';
import { UserProfile } from '@entities/user-profile.entity';
import { AuthResponseDTO, LoginUserDTO } from '@modules/auth/dto/auth.dto';
import { FindManyOptions, ILike, In, Not } from 'typeorm';
import { UserFollowerService } from '@modules/user-follower/user-follower.service';
import { UserConnectionService } from '@modules/user-connection/user-connection.service';
import { AuthService } from '@modules/auth/auth.service';

@Injectable()
export class UserService extends GenericService(User) {
  constructor(
    private readonly userProfileSrv: UserProfileService,
    private readonly userConnectionSrv: UserConnectionService,
    private readonly userFollowerSrv: UserFollowerService,
    @Inject(forwardRef(() => AuthService))
    private readonly authSrv: AuthService,
  ) {
    super();
  }

  async createUser(payload: LoginUserDTO): Promise<AuthResponseDTO> {
    try {
      checkForRequiredFields(['email', 'password'], payload);
      validateEmailField(payload.email);

      const emailLowercase = payload.email.toLowerCase();
      const findMatch = await this.findOne({ email: emailLowercase });
      if (findMatch?.id) {
        throw new ConflictException(
          'User with email already exists. Try using another',
        );
      }
      const record = await this.create<Partial<User>>({
        email: emailLowercase,
        password: payload.password,
        uniqueVerificationCode: generateUniqueCode(),
      });
      const loginResult = await this.authSrv.login({
        email: record.email,
        password: payload.password,
      });
      return {
        ...loginResult,
        message: 'Account created',
      };
    } catch (ex) {
      this.logger.error(ex);
      throw ex;
    }
  }

  async createStudentPersonalData(
    payload: CreateStudentDTO,
  ): Promise<UserResponseDTO> {
    try {
      checkForRequiredFields(
        [
          'country',
          'departmentId',
          'firstName',
          'lastName',
          'institutionId',
          'level',
          'role',
          'userId',
        ],
        payload,
      );
      const {
        country,
        departmentId,
        firstName,
        lastName,
        institutionId,
        level,
        role,
        bio,
      } = payload;
      compareEnumValueFields(role, Object.values(AppRole), 'role');
      compareEnumValueFields(level, Object.values(EducationalLevel), 'level');
      const recordFound = await this.findOne({ id: payload.userId });
      if (!recordFound?.id) {
        throw new NotFoundException('User not found');
      }
      const userProfileRecord = await this.userProfileSrv.getRepo().findOne({
        where: { userId: payload.userId },
        select: ['id'],
      });
      if (userProfileRecord?.id) {
        throw new ConflictException('User already has profile data');
      }
      await this.userProfileSrv.create<Partial<UserProfile>>({
        departmentId,
        institutionId,
        level,
        firstName,
        lastName,
        bio,
        userId: payload.userId,
      });
      await this.getRepo().update(
        { id: payload.userId },
        { role, country: country.toUpperCase() },
      );
      const record = await this.findOne({ id: payload.userId });
      return {
        code: HttpStatus.CREATED,
        data: record,
        message: 'Created',
        success: true,
      };
    } catch (ex) {
      this.logger.error(ex);
      throw ex;
    }
  }

  async createLecturerPersonalData(
    payload: CreateLecturerDTO,
  ): Promise<UserResponseDTO> {
    try {
      checkForRequiredFields(
        ['departmentId', 'institutionId', 'role', 'userId', 'bio'],
        payload,
      );
      const { departmentId, institutionId, role, bio } = payload;
      compareEnumValueFields(role, Object.values(AppRole), 'role');
      const recordFound = await this.findOne({ id: payload.userId });
      if (!recordFound?.id) {
        throw new NotFoundException('User not found');
      }
      const userProfileRecord = await this.userProfileSrv.getRepo().findOne({
        where: { userId: payload.userId },
        select: ['id'],
      });
      if (userProfileRecord?.id) {
        throw new ConflictException('User already has profile data');
      }
      await this.userProfileSrv.create<Partial<UserProfile>>({
        userId: payload.userId,
        departmentId,
        institutionId,
        bio,
      });
      await this.getRepo().update({ id: payload.userId }, { role });
      const record = await this.findOne({ id: payload.userId });
      return {
        code: HttpStatus.CREATED,
        data: record,
        message: 'Created',
        success: true,
      };
    } catch (ex) {
      this.logger.error(ex);
      throw ex;
    }
  }

  async updateUser(payload: UpdateUserDTO): Promise<BaseResponseTypeDTO> {
    try {
      checkForRequiredFields(['userId'], payload);
      const recordExists = await this.findOne({ id: payload.userId });
      if (!recordExists?.id) {
        throw new NotFoundException();
      }
      if (
        payload.profileImageUrl &&
        payload.profileImageUrl !== recordExists.profileImageUrl
      ) {
        recordExists.profileImageUrl = payload.profileImageUrl;
      }

      if (payload.email && payload.email !== recordExists.email) {
        const emailLowercase = payload.email?.toLowerCase();
        validateEmailField(emailLowercase);
        recordExists.email = emailLowercase;
      }
      if ('status' in payload) {
        recordExists.status = payload.status;
      }
      const updatedProfile: Partial<User> = {
        profileImageUrl: recordExists.profileImageUrl,
        email: recordExists.email,
      };
      await this.getRepo().update({ id: recordExists.id }, updatedProfile);
      return {
        code: HttpStatus.OK,
        message: 'Updated',
        success: true,
      };
    } catch (ex) {
      this.logger.error(ex);
      throw ex;
    }
  }

  async searchUsersByEmailAndName(
    searchTerm: string,
    paginationPayload?: PaginationRequestType,
  ): Promise<UsersResponseDTO> {
    try {
      if (!searchTerm) {
        throw new BadRequestException('Field searchTerm is required');
      }
      const users = await this.getRepo().find({
        where: { status: true, email: ILike(`%${searchTerm}%`) },
        relations: ['userProfiles'],
      });
      const relations = ['user', 'user.userProfiles'];
      let userProfileFilter: FindManyOptions = {
        where: [
          { firstName: ILike(`%${searchTerm}%`) },
          { lastName: ILike(`%${searchTerm}%`) },
        ],
        relations,
      };
      if (users?.length > 0) {
        const userIds = users.map(({ id }) => id);
        userProfileFilter = {
          where: [
            { userId: Not(In(userIds)), firstName: ILike(`%${searchTerm}%`) },
            { userId: Not(In(userIds)), lastName: ILike(`%${searchTerm}%`) },
          ],
          relations,
        };
      }
      const searchResultsByName = await this.userProfileSrv
        .getRepo()
        .find(userProfileFilter);
      users.push(...searchResultsByName.map(({ user }) => user));

      if (paginationPayload?.pageNumber) {
        const { response, paginationControl } = calculatePagination(
          users,
          paginationPayload,
        );
        return {
          success: true,
          code: HttpStatus.OK,
          message: 'Records found',
          data: response,
          paginationControl,
        };
      }
      return {
        success: true,
        code: HttpStatus.OK,
        message: 'Records found',
        data: users,
      };
    } catch (ex) {
      this.logger.error(ex);
      throw ex;
    }
  }

  async verifyCodeAfterSignup(
    uniqueVerificationCode: string,
    userId: string,
  ): Promise<BaseResponseTypeDTO> {
    try {
      const codeExists = await this.getRepo().findOne({
        where: { uniqueVerificationCode },
        select: ['id'],
      });
      if (codeExists?.id) {
        if (codeExists.id !== userId) {
          throw new ForbiddenException('This code does not belong to you');
        }
        // Activate the user account
        await this.getRepo().update({ id: codeExists.id }, { status: true });
        return {
          success: true,
          code: HttpStatus.OK,
          message: 'Code verified',
        };
      }
      throw new NotFoundException('Code was not found');
    } catch (ex) {
      throw ex;
    }
  }

  async resendOTPAfterLogin(userId: string): Promise<BaseResponseTypeDTO> {
    try {
      if (!userId) {
        throw new BadRequestException('Field userId is required');
      }
      const record = await this.findOne({ id: userId });
      if (!record?.id) {
        throw new NotFoundException();
      }
      let token = record.uniqueVerificationCode;
      if (!token) {
        token = generateUniqueCode();
        await this.getRepo().update(
          { id: record.id },
          { uniqueVerificationCode: token },
        );
      }
      const htmlEmailTemplate = `
          <h2>Please copy the code below to verify your account</h2>
          <h3>${token}</h3>
        `;
      await sendEmail(htmlEmailTemplate, 'Verify Account', [record.email]);
      return {
        success: true,
        code: HttpStatus.OK,
        message: 'Token has been resent',
      };
    } catch (ex) {
      this.logger.error(ex);
      throw ex;
    }
  }

  async initiateForgotPasswordFlow(
    email: string,
  ): Promise<BaseResponseTypeDTO> {
    try {
      const userExists = await this.findOne({ email: email.toLowerCase() });
      if (userExists?.id) {
        const uniqueCode = generateUniqueCode();
        await this.getRepo().update(
          { id: userExists.id },
          { uniqueVerificationCode: uniqueCode },
        );

        // Send email
        const htmlEmailTemplate = `
            <h2>Please copy the code below to verify your account ownership</h2>
            <h3>${uniqueCode}</h3>
          `;
        const emailResponse = await sendEmail(
          htmlEmailTemplate,
          'Verify Account Ownership',
          [email],
        );
        if (emailResponse.success) {
          return {
            ...emailResponse,
            message: 'Confirmation email sent',
          };
        }
        throw new InternalServerErrorException('Email was not sent');
      }
      throw new NotFoundException('User was not found');
    } catch (ex) {
      throw ex;
    }
  }

  async finalizeForgotPasswordFlow(
    uniqueVerificationCode: string,
  ): Promise<BaseResponseTypeDTO> {
    try {
      const userExists = await this.findOne({
        uniqueVerificationCode,
      });
      if (userExists?.id) {
        return {
          success: true,
          code: HttpStatus.OK,
          message: 'Unique token is valid',
        };
      }
      throw new NotFoundException('Invalid verification code');
    } catch (ex) {
      throw ex;
    }
  }

  async changePassword({
    uniqueVerificationCode,
    newPassword,
  }: UpdatePasswordDTO): Promise<BaseResponseTypeDTO> {
    try {
      const userExists = await this.findOne({
        uniqueVerificationCode,
      });
      if (userExists?.id) {
        const doesOldAndNewPasswordMatch = await verifyPasswordHash(
          newPassword,
          userExists.password,
        );
        if (doesOldAndNewPasswordMatch) {
          const message = 'Both old and new password match';
          throw new ConflictException(message);
        }
        const hashedPassword = await hashPassword(newPassword);
        await this.getRepo().update(
          { id: userExists.id },
          {
            uniqueVerificationCode: null,
            password: hashedPassword,
          },
        );
        return {
          success: true,
          code: HttpStatus.OK,
          message: 'Password changed successfully',
        };
      }
      throw new NotFoundException('Invalid verification code');
    } catch (ex) {
      throw ex;
    }
  }

  async findUserById(userId: string): Promise<UserResponseDTO> {
    try {
      const data = await this.findOne({ id: userId });
      if (data?.id) {
        return {
          success: true,
          code: HttpStatus.OK,
          data,
          message: 'User found',
        };
      }
      throw new NotFoundException('User not found');
    } catch (ex) {
      throw ex;
    }
  }

  async findUserByIdWithRelations(userId: string): Promise<UserResponseDTO> {
    try {
      const data = await this.getRepo().findOne({
        where: { id: userId },
        relations: [
          'userSettings',
          'userProfiles',
          'userInterests',
          'userInterests.interest',
          'userProfiles.institution',
          'userProfiles.department',
          'articlesWrittenByThisUser',
          'reactionsToArticlesMadeByThisUser',
          'commentsMadeByThisUser',
          'likesOnCommentsMadeByThisUser',
          'repliesToCommentsMadeByThisUser',
          'postsMadeByThisUser',
          'commentsToPostsMadeByThisUser',
          'commentRepliesToPostsMadeByThisUser',
          'postLikesForThisUser',
          'postLikesForThisUser.post',
          'forumQuestionsByThisUser',
          'forumAnswerReactionsByThisUser',
          'userConnectionRecords',
          'userConnectionRecords.user',
          'userConnectionRecords.connectedToUser',
          'connectedToUserRecords',
          'connectedToUserRecords.connectedToUser',
          'connectedToUserRecords.user',
          'userFollowerRecords',
          'followingUserRecords',
        ],
      });
      if (data?.id) {
        return {
          success: true,
          code: HttpStatus.OK,
          data,
          message: 'User found',
        };
      }
      throw new NotFoundException('User not found');
    } catch (ex) {
      throw ex;
    }
  }

  async findUserByIdForComments(userId: string): Promise<any[]> {
    try {
      const data = await this.findOne({ id: userId });
      if (data?.id) {
        return data.commentsMadeByThisUser;
      }
      throw new NotFoundException('User not found');
    } catch (ex) {
      throw ex;
    }
  }

  async findUserByIdForReplies(userId: string): Promise<any[]> {
    try {
      const data = await this.findOne({ id: userId });
      if (data?.id) {
        return data.repliesToCommentsMadeByThisUser;
      }
      throw new NotFoundException('User not found');
    } catch (ex) {
      throw ex;
    }
  }

  async findAllUsers(
    payload?: PaginationRequestType,
  ): Promise<UsersResponseDTO> {
    try {
      if (payload?.pageNumber) {
        payload = {
          pageSize: parseInt(`${payload.pageSize}`),
          pageNumber: parseInt(`${payload.pageNumber}`),
        };

        const options: FindManyOptions = {
          take: payload.pageSize,
          skip: (payload.pageNumber - 1) * payload.pageSize,
        };
        const { response, paginationControl } =
          await calculatePaginationControls<User>(
            this.getRepo(),
            options,
            payload,
          );
        return {
          success: true,
          message: 'Users found',
          code: HttpStatus.OK,
          data: response,
          paginationControl: paginationControl,
        };
      } else {
        const data = await this.findAll();
        return {
          code: HttpStatus.FOUND,
          data,
          message: 'Users found',
          success: true,
        };
      }
    } catch (ex) {
      throw ex;
    }
  }

  async findUserByEmailAndPassword(
    email: string,
    password: string,
  ): Promise<UserResponseDTO> {
    try {
      const user = await this.findOne({ email });
      if (user?.id && (await verifyPasswordHash(password, user.password))) {
        return {
          success: true,
          code: HttpStatus.OK,
          data: user,
          message: 'User found',
        };
      }
      throw new NotFoundException('Invalid credentials');
    } catch (ex) {
      this.logger.error(ex);
      throw ex;
    }
  }

  async userProfileCount(userId: string): Promise<UserProfileSummaryCountDTO> {
    try {
      if (!userId) {
        throw new BadRequestException('Field userId is required');
      }
      let numberOfFollowing = 0,
        numberOfFollowers = 0,
        numberOfConnections = 0;
      numberOfFollowing = await this.userFollowerSrv.getRepo().count({
        where: { followUserId: userId },
      });
      numberOfFollowers = await this.userFollowerSrv.getRepo().count({
        where: { userId },
      });
      numberOfConnections = await this.userConnectionSrv.getRepo().count({
        where: { userId },
      });
      return {
        numberOfConnections,
        numberOfFollowers,
        numberOfFollowing,
      };
    } catch (ex) {
      this.logger.error(ex);
      throw ex;
    }
  }

  async updateUserProfilePayload(
    payload: UpdateUserDTO,
    userId: string,
  ): Promise<BaseResponseTypeDTO> {
    try {
      if (!userId) {
        throw new BadRequestException('Field userId is Required');
      }
      const user = await this.getRepo().findOne({
        where: [{ id: userId }],
        relations: ['userProfiles'],
      });

      if (!user) {
        throw new NotFoundException('User not found');
      }
      const { phoneNumber, email, profileImageUrl, role, country } = payload;

      if (role && user.role !== role) {
        compareEnumValueFields(role, Object.values(AppRole), 'role');
        user.role = role;
      }
      if (phoneNumber && user.phoneNumber !== phoneNumber) {
        const phoneNumberExists = await this.getRepo().findOne({
          where: { phoneNumber },
          select: ['id'],
        });
        if (phoneNumberExists?.id) {
          throw new NotFoundException('PhoneNumber already exists');
        }
        user.phoneNumber = phoneNumber;
      }
      if (email && user.email !== email) {
        const emailExists = await this.getRepo().findOne({
          where: { email },
          select: ['id'],
        });
        if (emailExists?.id) {
          throw new ConflictException(
            'User with email already exists. Try using another',
          );
        }
        user.email = email;
      }
      if (profileImageUrl && user.profileImageUrl !== profileImageUrl) {
        user.profileImageUrl = profileImageUrl;
      }
      if (country && user.country !== country) {
        user.country = country;
      }
      if ('status' in payload) {
        user.status = payload.status;
      }
      const updatedUser: Partial<User> = {
        phoneNumber: user.phoneNumber,
        email: user.email,
        profileImageUrl: user.profileImageUrl,
        country: user.country,
        status: user.status,
        role: user.role,
      };
      await this.getRepo().update({ id: userId }, updatedUser);

      const profileFields = [
        'firstName',
        'lastName',
        'dateOfBirth',
        'idCardName',
        'idCardNumber',
        'idCard',
        'dateIssued',
        'category',
        'level',
      ];
      if (arrayIncludesAny(Object.keys(payload), profileFields)) {
        const profile = user.userProfiles[0];
        if (profile?.id) {
          await this.userProfileSrv.updateProfile(payload, profile.id);
        }
      }
      return { success: true, code: HttpStatus.OK, message: 'Updated' };
    } catch (ex) {
      throw ex;
    }
  }

  async deleteUser(userId: string): Promise<BaseResponseTypeDTO> {
    try {
      await this.delete({ id: userId });
      return {
        code: HttpStatus.OK,
        message: 'User deleted',
        success: true,
      };
    } catch (ex) {
      throw ex;
    }
  }

  async changeAccountPassword(
    payload: ChangePasswordDTO,
    userId: string,
  ): Promise<BaseResponseTypeDTO> {
    try {
      checkForRequiredFields(['currentPassword', 'newPassword'], payload);
      const record = await this.findOne({ id: userId });
      if (!record?.id) {
        throw new NotFoundException();
      }
      const verifyCurrentPassword = await verifyPasswordHash(
        payload.currentPassword,
        record.password,
      );
      if (!verifyCurrentPassword) {
        throw new BadRequestException('Could not verify current password');
      }
      const newPasswordHash = await hashPassword(payload.newPassword);
      await this.getRepo().update(
        { id: record.id },
        { password: newPasswordHash },
      );
      return {
        success: true,
        code: HttpStatus.OK,
        message: 'Password changed',
      };
    } catch (ex) {
      this.logger.error(ex);
      throw ex;
    }
  }

  async deleteUserByEmail(email: string): Promise<BaseResponseTypeDTO> {
    try {
      const userExists = await this.findOne({ email });
      if (userExists?.id) {
        await this.delete({ email });
        return {
          code: HttpStatus.OK,
          message: 'User deleted',
          success: true,
        };
      }
      throw new NotFoundException('User was not found');
    } catch (ex) {
      throw ex;
    }
  }

  async updateAccountInfo(
    payload: UpdateUserAccountInfoDTO,
    userId: string,
  ): Promise<BaseResponseTypeDTO> {
    try {
      const { institutionId, departmentId, level, role } = payload;
      if (!userId) {
        throw new BadRequestException("Field 'userId' is Required");
      }
      const userAccountInfo = await this.getRepo().findOne({
        where: [{ id: userId }],
      });
      const userProfileInfo = await this.userProfileSrv
        .getRepo()
        .findOne({ where: [{ userId }] });

      if (!userAccountInfo || !userProfileInfo) {
        throw new NotFoundException('User Not Found');
      }

      if (role && userAccountInfo.role !== role) {
        userAccountInfo.role = role;
      }

      if (institutionId && userProfileInfo.institutionId !== institutionId) {
        userProfileInfo.institutionId = institutionId;
      }

      if (departmentId && userProfileInfo.departmentId !== departmentId) {
        userProfileInfo.departmentId = departmentId;
      }

      if (level && userProfileInfo.level !== level) {
        userProfileInfo.level = level;
      }

      const updatedUserRole: Partial<User> = {
        role: userAccountInfo.role,
      };

      const updateUserProfile: Partial<UserProfile> = {
        institutionId: userProfileInfo.institutionId,
        departmentId: userProfileInfo.departmentId,
        level: userProfileInfo.level,
      };
      const updatedResultForUserRole = await this.getRepo().update(
        { id: userId },
        updatedUserRole,
      );
      const updatedResultForUserProfile = await this.userProfileSrv
        .getRepo()
        .update({ userId }, updateUserProfile);

      if (!updatedResultForUserRole || !updatedResultForUserProfile) {
        throw new NotImplementedException('UPDATE INCOMPLETE');
      }
      return {
        code: HttpStatus.OK,
        message: 'CHANGES SAVED',
        success: true,
      };
    } catch (ex) {
      throw ex;
    }
  }
}
