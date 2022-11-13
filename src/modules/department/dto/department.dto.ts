import { Department } from '@entities/department.entity';
import { ApiProperty, PartialType } from '@nestjs/swagger';
import { BaseResponseTypeDTO } from '@utils/types/utils.types';

export class DepartmentsResponseDTO extends BaseResponseTypeDTO {
  @ApiProperty({
    type: () => [Department],
  })
  data: Department[];
}

export class DepartmentResponseDTO extends BaseResponseTypeDTO {
  @ApiProperty({
    type: () => Department,
  })
  data: Department;
}

export class CreateDepartmentDTO {
  @ApiProperty()
  name: string;
}

export class UpdateDepartmentDTO extends PartialType(CreateDepartmentDTO) {
  @ApiProperty()
  departmentId: string;

  @ApiProperty({ nullable: true })
  status?: boolean;
}
