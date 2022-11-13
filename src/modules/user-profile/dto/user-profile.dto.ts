import { UserProfile } from '@entities/user-profile.entity';
import { ApiProperty, PartialType } from '@nestjs/swagger';
import {
  EducationalCategory,
  EducationalLevel,
} from '@utils/types/utils.constant';
import { BaseResponseTypeDTO } from '@utils/types/utils.types';

export class CreateUserProfileDTO {
  @ApiProperty()
  firstName: string;

  @ApiProperty()
  lastName: string;

  @ApiProperty()
  dateOfBirth: string;

  @ApiProperty()
  idCardName: string;

  @ApiProperty()
  idCardNumber: string;

  @ApiProperty()
  idCard: string;

  @ApiProperty()
  dateIssued: string;

  @ApiProperty({ enum: EducationalCategory })
  category?: EducationalCategory;

  @ApiProperty({ enum: EducationalLevel })
  level?: EducationalLevel;

  @ApiProperty()
  departmentId: string;

  @ApiProperty()
  institutionId: string;
}

export class CreateIDVerificationDTO {
  @ApiProperty()
  dateOfBirth: string;

  @ApiProperty()
  idCardName: string;

  @ApiProperty()
  idCardNumber: string;

  @ApiProperty()
  idCard: string;

  @ApiProperty({ description: 'Date String' })
  dateIssued: string;

  @ApiProperty({ enum: EducationalCategory })
  category?: EducationalCategory;
}

export class UpdateUserProfileDTO extends PartialType(CreateUserProfileDTO) {
  @ApiProperty()
  userProfileId: string;

  @ApiProperty()
  phoneNumber?: string;

  @ApiProperty()
  email?: string;

  @ApiProperty({ nullable: true, description: 'URL' })
  profileImageUrl?: string;

  @ApiProperty()
  country?: string;

  @ApiProperty({ type: Boolean })
  status?: boolean;
}

export class UserProfileResponseDTO extends BaseResponseTypeDTO {
  @ApiProperty({ type: () => UserProfile })
  data: UserProfile;
}

export class UserProfilesResponseDTO extends BaseResponseTypeDTO {
  @ApiProperty({ type: () => [UserProfile] })
  data: UserProfile[];
}
