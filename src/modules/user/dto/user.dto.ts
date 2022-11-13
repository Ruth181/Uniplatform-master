import { ApiProperty, PartialType, PickType } from '@nestjs/swagger';
import { User } from '@entities/user.entity';
import {
  AppRole,
  EducationalCategory,
  EducationalLevel,
} from '@utils/types/utils.constant';
import {
  BaseResponseTypeDTO,
  PaginationResponseType,
} from '@utils/types/utils.types';

export class UserResponseDTO extends BaseResponseTypeDTO {
  @ApiProperty({ type: () => User })
  data: User;
}

export class UsersResponseDTO extends BaseResponseTypeDTO {
  @ApiProperty({ type: () => [User] })
  data: User[];

  @ApiProperty({ type: () => PaginationResponseType })
  paginationControl?: PaginationResponseType;
}

export class ChangePasswordDTO {
  @ApiProperty()
  currentPassword: string;

  @ApiProperty()
  newPassword: string;
}

export class CreateStudentDTO {
  @ApiProperty()
  firstName: string; // userProfile

  @ApiProperty()
  lastName: string; // userProfile

  @ApiProperty()
  country: string; // user

  @ApiProperty()
  institutionId: string; // userProfile

  @ApiProperty({ enum: EducationalLevel })
  level: EducationalLevel; // userProfile

  @ApiProperty()
  departmentId: string; // userProfile

  @ApiProperty({ enum: AppRole })
  role: AppRole; // user

  @ApiProperty()
  bio: string;

  @ApiProperty()
  userId: string;
}

export class CreateLecturerDTO extends PickType(CreateStudentDTO, [
  'institutionId',
  'departmentId',
  'role',
  'bio',
  'userId',
] as const) {}

export class UpdateUserDTO extends PartialType(CreateStudentDTO) {
  @ApiProperty()
  userId: string;

  @ApiProperty({ nullable: true })
  phoneNumber?: string;

  @ApiProperty({ nullable: true })
  idCardName?: string;

  @ApiProperty({ nullable: true })
  idCardNumber?: string;

  @ApiProperty({ nullable: true })
  idCard?: string;

  @ApiProperty({ nullable: true })
  dateOfBirth?: Date;

  @ApiProperty({ nullable: true })
  dateIssued?: Date;

  @ApiProperty({ nullable: true, enum: EducationalCategory })
  category?: EducationalCategory;

  @ApiProperty({ nullable: true })
  email?: string;

  @ApiProperty({ nullable: true })
  profileImageUrl?: string;

  @ApiProperty({ nullable: true })
  status?: boolean;
}

export class UpdatePasswordDTO {
  @ApiProperty()
  uniqueVerificationCode: string;

  @ApiProperty()
  newPassword: string;
}

export class UpdateUserAccountInfoDTO {
  @ApiProperty({ nullable: true })
  institutionId?: string;

  @ApiProperty({ nullable: true })
  departmentId?: string;

  @ApiProperty({ enum: EducationalLevel })
  level?: EducationalLevel;

  @ApiProperty({ enum: AppRole })
  role?: AppRole;
}

export class UserProfileSummaryCountDTO {
  @ApiProperty()
  numberOfFollowers: number;

  @ApiProperty()
  numberOfConnections: number;

  @ApiProperty()
  numberOfFollowing: number;
}
