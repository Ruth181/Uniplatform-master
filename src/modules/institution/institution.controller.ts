import { DepartmentResponseDTO } from '@modules/department/dto/department.dto';
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
import {
  CreateInstitutionDTO,
  InstitutionResponseDTO,
  InstitutionsResponseDTO,
  UpdateInstitutionDTO,
} from './dto/institution.dto';
import { InstitutionService } from './institution.service';

@ApiTags('institution')
@Controller('institution')
export class InstitutionController {
  constructor(private readonly institutionSrv: InstitutionService) {}

  @ApiOperation({
    description: 'Create department',
  })
  @ApiProduces('json')
  @ApiConsumes('application/json')
  @ApiResponse({
    type: InstitutionResponseDTO,
  })
  @Post()
  async createInstitution(
    @Body() payload: CreateInstitutionDTO,
  ): Promise<InstitutionResponseDTO> {
    return await this.institutionSrv.createInstitution(payload);
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
  async createInstitutionsInBulk(
    @UploadedFile() excelSheet: Express.Multer.File,
  ): Promise<InstitutionsResponseDTO> {
    const path = `uploads/${excelSheet.filename}`;
    return await this.institutionSrv.createInstitutionsInBulk(path);
  }

  @ApiOperation({
    description: 'Find all Institutions',
  })
  @ApiProduces('json')
  @ApiConsumes('application/json')
  @ApiResponse({
    type: InstitutionsResponseDTO,
  })
  @Get()
  async findInstitutions(): Promise<InstitutionsResponseDTO> {
    return await this.institutionSrv.findInstitutions();
  }

  @ApiOperation({
    description: 'Find Institutions by status',
  })
  @ApiProduces('json')
  @ApiConsumes('application/json')
  @ApiResponse({
    type: InstitutionsResponseDTO,
  })
  @Get('/find-by-status:status')
  async findDepartmentsByStatus(
    @Param('status', ParseBoolPipe) status: boolean,
  ): Promise<InstitutionsResponseDTO> {
    return await this.institutionSrv.findInstitutionsByStatus(status);
  }

  @ApiOperation({
    description: 'Find department by id',
  })
  @ApiProduces('json')
  @ApiConsumes('application/json')
  @ApiResponse({
    type: DepartmentResponseDTO,
  })
  @Get('/:institutionId')
  async findDepartmentById(
    @Param('institutionId', ParseUUIDPipe) institutionId: string,
  ): Promise<InstitutionResponseDTO> {
    return await this.institutionSrv.findInstitutionById(institutionId);
  }

  @ApiOperation({
    description: 'Update institution',
  })
  @ApiProduces('json')
  @ApiConsumes('application/json')
  @ApiResponse({
    type: BaseResponseTypeDTO,
  })
  @Patch()
  async updateInstitutionId(
    @Body() payload: UpdateInstitutionDTO,
  ): Promise<BaseResponseTypeDTO> {
    return await this.institutionSrv.updateInstitution(payload);
  }
}
