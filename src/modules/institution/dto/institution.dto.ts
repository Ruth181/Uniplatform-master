import { Institution } from '@entities/institution.entity';
import { ApiProperty, PartialType } from '@nestjs/swagger';
import { BaseResponseTypeDTO } from '@utils/types/utils.types';

export class InstitutionsResponseDTO extends BaseResponseTypeDTO {
  @ApiProperty({
    type: () => [Institution],
  })
  data: Institution[];
}

export class InstitutionResponseDTO extends BaseResponseTypeDTO {
  @ApiProperty({
    type: () => Institution,
  })
  data: Institution;
}

export class CreateInstitutionDTO {
  @ApiProperty()
  name: string;
}

export class UpdateInstitutionDTO extends PartialType(CreateInstitutionDTO) {
  @ApiProperty()
  institutionId: string;

  @ApiProperty({ nullable: true })
  status?: boolean;
}
