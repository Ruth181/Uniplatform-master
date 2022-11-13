import { Interest } from '@entities/interest.entity';
import {
  BadRequestException,
  ConflictException,
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
import { ILike } from 'typeorm';
import {
  CreateInterestDTO,
  InterestResponseDTO,
  InterestsResponseDTO,
  UpdateInterestDTO,
} from './dto/interest.dto';

@Injectable()
export class InterestService extends GenericService(Interest) {
  async createInterest({
    name,
  }: CreateInterestDTO): Promise<InterestResponseDTO> {
    try {
      const interestExist = await this.getRepo().findOne({ where: [{ name }] });
      if (interestExist) {
        throw new ConflictException(`${name} Interest already exists`);
      }
      const record = await createDemo(this.getRepo(), name);
      return {
        code: HttpStatus.CREATED,
        data: record as Interest,
        message: 'Created',
        success: true,
      };
    } catch (ex) {
      this.logger.error(ex);
      throw ex;
    }
  }

  async createInterestsInBulk(
    excelFilePath: string,
  ): Promise<InterestsResponseDTO> {
    try {
      const excelData = extractExcelSheetData<{ NAME: string }>(excelFilePath);
      const records: Interest[] = [];
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

  async findInterestById(interestId: string): Promise<InterestResponseDTO> {
    try {
      const record = await findDemoById(this.getRepo(), interestId);
      return {
        code: HttpStatus.OK,
        data: record as Interest,
        message: 'Record found',
        success: true,
      };
    } catch (ex) {
      this.logger.error(ex);
      throw ex;
    }
  }

  async findInterests(): Promise<InterestsResponseDTO> {
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

  async searchForInterests(searchTerm: string): Promise<InterestsResponseDTO> {
    try {
      if (!searchTerm) {
        throw new BadRequestException('Field searchTerm is required');
      }
      const records = await this.getRepo().find({
        where: [{ name: ILike(`%${searchTerm}%`), status: true }],
      });
      return {
        code: HttpStatus.OK,
        data: records,
        message: 'Search results found',
        success: true,
      };
    } catch (ex) {
      this.logger.error(ex);
      throw ex;
    }
  }

  async findInterestsByStatus(status: boolean): Promise<InterestsResponseDTO> {
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

  async updateInterest(
    payload: UpdateInterestDTO,
  ): Promise<BaseResponseTypeDTO> {
    const { interestId, name, status } = payload;
    try {
      const record = await this.findOne({ id: interestId });
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
        { id: interestId },
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
