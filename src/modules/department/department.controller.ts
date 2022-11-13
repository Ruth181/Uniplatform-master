import {
  Body,
  Controller,
  Get,
  Param,
  ParseBoolPipe,
  ParseUUIDPipe,
  Patch,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiConsumes,
  ApiOperation,
  ApiProduces,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { BaseResponseTypeDTO } from '@utils/types/utils.types';
import { MulterValidators } from '@utils/validators/multer.validator';
import { diskStorage } from 'multer';
import { DepartmentService } from './department.service';
import {
  CreateDepartmentDTO,
  DepartmentResponseDTO,
  DepartmentsResponseDTO,
  UpdateDepartmentDTO,
} from './dto/department.dto';

@ApiTags('department')
@Controller('department')
export class DepartmentController {
  constructor(private readonly departmentSrv: DepartmentService) {}

  @ApiOperation({
    description: 'Create department',
  })
  @ApiProduces('json')
  @ApiConsumes('application/json')
  @ApiResponse({
    type: DepartmentResponseDTO,
  })
  @Post()
  async createDepartment(
    @Body() payload: CreateDepartmentDTO,
  ): Promise<DepartmentResponseDTO> {
    return await this.departmentSrv.createDepartment(payload);
  }

  @UseInterceptors(
    FileInterceptor('excelSheet', {
      storage: diskStorage({
        destination: './uploads',
        filename: MulterValidators.preserveOriginalFileName,
      }),
      fileFilter: MulterValidators.excelFileFilter,
    }),
  )
  @Post('/create-bulk')
  async createDepartmentsInBulk(
    @UploadedFile() excelSheet: Express.Multer.File,
  ): Promise<DepartmentsResponseDTO> {
    const path = `uploads/${excelSheet.filename}`;
    return await this.departmentSrv.createDepartmentsInBulk(path);
  }

  @ApiOperation({
    description: 'Find all departments',
  })
  @ApiProduces('json')
  @ApiConsumes('application/json')
  @ApiResponse({
    type: DepartmentsResponseDTO,
  })
  @Get()
  async findDepartments(): Promise<DepartmentsResponseDTO> {
    return await this.departmentSrv.findDepartments();
  }

  @ApiOperation({
    description: 'Find departments by status',
  })
  @ApiProduces('json')
  @ApiConsumes('application/json')
  @ApiResponse({
    type: DepartmentsResponseDTO,
  })
  @Get('/find-by-status:status')
  async findDepartmentsByStatus(
    @Param('status', ParseBoolPipe) status: boolean,
  ): Promise<DepartmentsResponseDTO> {
    return await this.departmentSrv.findDepartmentsByStatus(status);
  }

  @ApiOperation({
    description: 'Find department by id',
  })
  @ApiProduces('json')
  @ApiConsumes('application/json')
  @ApiResponse({
    type: DepartmentResponseDTO,
  })
  @Get('/:departmentId')
  async findDepartmentById(
    @Param('departmentId', ParseUUIDPipe) departmentId: string,
  ): Promise<DepartmentResponseDTO> {
    return await this.departmentSrv.findDepartmentById(departmentId);
  }

  @ApiOperation({
    description: 'Update department',
  })
  @ApiProduces('json')
  @ApiConsumes('application/json')
  @ApiResponse({
    type: BaseResponseTypeDTO,
  })
  @Patch()
  async updateDepartment(
    @Body() payload: UpdateDepartmentDTO,
  ): Promise<BaseResponseTypeDTO> {
    return await this.departmentSrv.updateDepartment(payload);
  }
}
