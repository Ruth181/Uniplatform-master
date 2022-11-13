import { Department } from '@entities/department.entity';
import { Interest } from '@entities/interest.entity';
import { ApiProperty, PartialType } from '@nestjs/swagger';
import { BaseResponseTypeDTO } from '@utils/types/utils.types';

export class InterestsResponseDTO extends BaseResponseTypeDTO {
  @ApiProperty({
    type: () => [Interest],
  })
  data: Interest[];
}

export class InterestResponseDTO extends BaseResponseTypeDTO {
  @ApiProperty({
    type: () => Interest,
  })
  data: Interest;
}
 
export class CreateInterestDTO {
  @ApiProperty()
  name: string;
}

export class UpdateInterestDTO extends PartialType(CreateInterestDTO) {
  @ApiProperty()
  interestId: string;

  @ApiProperty({ nullable: true })
  status?: boolean;
}
