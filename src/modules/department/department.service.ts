import { Department } from '@entities/department.entity';
import {
  BadRequestException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { GenericService } from '@schematics/services/generic.service';
import {
  createDemo,
  extractExcelSheetData,
  findDemoById,
} from '@utils/functions/utils.function';
import { BaseResponseTypeDTO } from '@utils/types/utils.types';

import {
  CreateDepartmentDTO,
  DepartmentResponseDTO,
  DepartmentsResponseDTO,
  UpdateDepartmentDTO,
} from './dto/department.dto';

@Injectable()
export class DepartmentService extends GenericService(Department) {
  async createDepartment({
    name,
  }: CreateDepartmentDTO): Promise<DepartmentResponseDTO> {
    try {
      const record = await createDemo(this.getRepo(), name);
      return {
        code: HttpStatus.CREATED,
        data: record as Department,
        message: 'Created',
        success: true,
      };
    } catch (ex) {
      this.logger.error(ex);
      throw ex;
    }
  }

  async createDepartmentsInBulk(
    excelFilePath: string,
  ): Promise<DepartmentsResponseDTO> {
    try {
      const excelData = extractExcelSheetData<{ NAME: string }>(excelFilePath);
      const records: Department[] = [];
      for (const item of excelData) {
        const nameToUppercase = item.NAME?.toUpperCase();
        const recordExists = await this.findOne({
          name: nameToUppercase,
        });
        if (!recordExists?.id) {
          const createdRecord = await this.create({ name: nameToUppercase });
          records.push(createdRecord);
        }
      }
      return {
        success: true,
        code: HttpStatus.CREATED,
        data: records,
        message: 'Created',
      };
    } catch (ex) {
      this.logger.error(ex);
      throw ex;
    }
  }

  async findDepartmentById(
    departmentId: string,
  ): Promise<DepartmentResponseDTO> {
    try {
      const record = await findDemoById(this.getRepo(), departmentId);
      return {
        code: HttpStatus.OK,
        data: record as Department,
        message: 'Record found',
        success: true,
      };
    } catch (ex) {
      this.logger.error(ex);
      throw ex;
    }
  }

  async findDepartments(): Promise<DepartmentsResponseDTO> {
    try {
      const records = await this.findAll();
      return {
        code: HttpStatus.OK,
        data: records,
        message: 'Records found',
        success: true,
      };
    } catch (ex) {
      this.logger.error(ex);
      throw ex;
    }
  }

  async findDepartmentsByStatus(
    status: boolean,
  ): Promise<DepartmentsResponseDTO> {
    try {
      if (typeof status === 'undefined') {
        throw new BadRequestException('Field status is required');
      }
      const records = await this.findAllByCondition({ status });
      return {
        code: HttpStatus.OK,
        data: records,
        message: 'Records found',
        success: true,
      };
    } catch (ex) {
      this.logger.error(ex);
      throw ex;
    }
  }

  async updateDepartment(
    payload: UpdateDepartmentDTO,
  ): Promise<BaseResponseTypeDTO> {
    const { departmentId, name, status } = payload;
    try {
      const record = await this.findOne({ id: departmentId });
      if (!record?.id) {
        throw new NotFoundException();
      }
      if (name) {
        const nameToUppercase = name.toUpperCase();
        if (nameToUppercase !== record.name) {
          record.name = nameToUppercase;
        }
      }
      if ('status' in payload) {
        record.status = status;
      }
      await this.getRepo().update(
        { id: departmentId },
        { status: record.status, name: record.name },
      );
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
}
