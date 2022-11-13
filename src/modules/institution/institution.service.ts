import {
  BadRequestException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { GenericService } from '@schematics/services/generic.service';
import { Institution } from '@entities/institution.entity';
import {
  CreateInstitutionDTO,
  InstitutionResponseDTO,
  InstitutionsResponseDTO,
  UpdateInstitutionDTO,
} from './dto/institution.dto';
import {
  createDemo,
  extractExcelSheetData,
  findDemoById,
} from '@utils/functions/utils.function';
import { BaseResponseTypeDTO } from '@utils/types/utils.types';

@Injectable()
export class InstitutionService extends GenericService(Institution) {
  async createInstitution({
    name,
  }: CreateInstitutionDTO): Promise<InstitutionResponseDTO> {
    try {
      const record = await createDemo(this.getRepo(), name);
      return {
        code: HttpStatus.CREATED,
        data: record as Institution,
        message: 'Created',
        success: true,
      };
    } catch (ex) {
      this.logger.error(ex);
      throw ex;
    }
  }

  async createInstitutionsInBulk(
    excelFilePath: string,
  ): Promise<InstitutionsResponseDTO> {
    try {
      const excelData = extractExcelSheetData<{ NAME: string }>(excelFilePath);
      const records: Institution[] = [];
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

  async findInstitutionById(
    institutionId: string,
  ): Promise<InstitutionResponseDTO> {
    try {
      const record = await findDemoById(this.getRepo(), institutionId);
      return {
        code: HttpStatus.OK,
        data: record as Institution,
        message: 'Record found',
        success: true,
      };
    } catch (ex) {
      this.logger.error(ex);
      throw ex;
    }
  }

  async findInstitutions(): Promise<InstitutionsResponseDTO> {
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

  async findInstitutionsByStatus(
    status: boolean,
  ): Promise<InstitutionsResponseDTO> {
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

  async updateInstitution(
    payload: UpdateInstitutionDTO,
  ): Promise<BaseResponseTypeDTO> {
    const { institutionId, name, status } = payload;
    try {
      const record = await this.findOne({ id: institutionId });
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
        { id: institutionId },
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
