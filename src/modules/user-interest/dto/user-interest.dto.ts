import { UserInterest } from '@entities/user-interest.entity';
import { ApiProperty } from '@nestjs/swagger';
import { BaseResponseTypeDTO } from '@utils/types/utils.types';

export class UserInterestsResponseDTO extends BaseResponseTypeDTO {
  @ApiProperty({
    type: () => [UserInterest],
  })
  data: UserInterest[];
}

export class UserInterestResponseDTO extends BaseResponseTypeDTO {
  @ApiProperty({
    type: () => UserInterest,
  })
  data: UserInterest;
}

export class CreateUserInterestDTO {
  @ApiProperty()
  userId: string;

  @ApiProperty({ type: () => [String] })
  interestIds: string[];
}
