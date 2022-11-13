import {
  Injectable,
  BadRequestException,
  ConflictException,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';
import { GenericService } from '@schematics/services/generic.service';
import {
  calculatePaginationControls,
  checkForRequiredFields,
} from '@utils/functions/utils.function';
import { PaginationRequestType } from '@utils/types/utils.types';
import { Forum } from '@entities/forum.entity';
import { FindManyOptions, ILike } from 'typeorm';
import {
  CreateForumDTO,
  ForumResponseDTO,
  ForumsResponseDTO,
} from './dto/forum.dto';

@Injectable()
export class ForumService extends GenericService(Forum) {
  async createForumEntry(
    payload: CreateForumDTO,
    userId: string,
  ): Promise<ForumResponseDTO> {
    try {
      checkForRequiredFields(['title', 'reference', 'question'], payload);
      const { title, reference } = payload;
      if (reference?.length <= 0) {
        throw new BadRequestException('No references were added');
      }
      const record = await this.findOne({ title: title.toUpperCase() });
      if (record?.id) {
        throw new ConflictException('Question already exists');
      }
      const createdRecord = await this.create<Partial<Forum>>({
        ...payload,
        userId,
      });
      return {
        success: true,
        code: HttpStatus.CREATED,
        data: createdRecord,
        message: 'Created',
      };
    } catch (ex) {
      this.logger.error(ex);
      throw ex;
    }
  }

  async findForumEntryById(forumId: string): Promise<ForumResponseDTO> {
    try {
      if (!forumId) {
        throw new BadRequestException('Field forumId is required');
      }
      const record = await this.getRepo().findOne({
        where: { id: forumId },
        relations: ['answersForThisForum', 'user'],
      });
      if (!record?.id) {
        throw new NotFoundException();
      }
      return {
        success: true,
        code: HttpStatus.OK,
        data: record,
        message: 'Record found',
      };
    } catch (ex) {
      this.logger.error(ex);
      throw ex;
    }
  }

  async findForumEntries(
    payload?: PaginationRequestType,
    status = true,
  ): Promise<ForumsResponseDTO> {
    try {
      const filter = { status };
      const relations = ['answersForThisForum', 'user'];
      if (payload?.pageNumber) {
        payload = {
          pageSize: parseInt(`${payload.pageSize}`),
          pageNumber: parseInt(`${payload.pageNumber}`),
        };
        const options: FindManyOptions = {
          take: payload.pageSize,
          skip: (payload.pageNumber - 1) * payload.pageSize,
          where: filter,
          relations,
        };
        const { response, paginationControl } =
          await calculatePaginationControls<Forum>(
            this.getRepo(),
            options,
            payload,
          );
        return {
          success: true,
          message: 'Records found',
          code: HttpStatus.OK,
          data: response,
          paginationControl: paginationControl,
        };
      } else {
        const records = await this.getRepo().find({
          where: filter,
          relations,
        });
        return {
          success: true,
          code: HttpStatus.OK,
          data: records,
          message: 'Records found',
        };
      }
    } catch (ex) {
      this.logger.error(ex);
      throw ex;
    }
  }

  async findForumEntriesByUserId(
    userId: string,
    payload?: PaginationRequestType,
    status = true,
  ): Promise<ForumsResponseDTO> {
    try {
      const filter = { status, userId };
      const relations = ['answersForThisForum', 'user'];
      if (payload?.pageNumber) {
        payload = {
          pageSize: parseInt(`${payload.pageSize}`),
          pageNumber: parseInt(`${payload.pageNumber}`),
        };
        const options: FindManyOptions = {
          take: payload.pageSize,
          skip: (payload.pageNumber - 1) * payload.pageSize,
          where: filter,
          relations,
        };
        const { response, paginationControl } =
          await calculatePaginationControls<Forum>(
            this.getRepo(),
            options,
            payload,
          );
        return {
          success: true,
          message: 'Records found',
          code: HttpStatus.OK,
          data: response,
          paginationControl: paginationControl,
        };
      } else {
        const records = await this.getRepo().find({
          where: filter,
          relations,
        });
        return {
          success: true,
          code: HttpStatus.OK,
          data: records,
          message: 'Records found',
        };
      }
    } catch (ex) {
      this.logger.error(ex);
      throw ex;
    }
  }

  async searchForumEntries(
    searchTerm: string,
    payload?: PaginationRequestType,
  ): Promise<ForumsResponseDTO> {
    try {
      if (!searchTerm) {
        throw new BadRequestException('Search term not added');
      }
      const filter = [
        { title: ILike(`%${searchTerm}%`), status: true },
        { question: ILike(`%${searchTerm}%`), status: true },
      ];
      const relations = ['answersForThisForum', 'user'];
      if (payload?.pageNumber) {
        payload = {
          pageSize: parseInt(`${payload.pageSize}`),
          pageNumber: parseInt(`${payload.pageNumber}`),
        };
        const options: FindManyOptions = {
          take: payload.pageSize,
          skip: (payload.pageNumber - 1) * payload.pageSize,
          where: filter,
          relations,
        };
        const { response, paginationControl } =
          await calculatePaginationControls<Forum>(
            this.getRepo(),
            options,
            payload,
          );
        return {
          success: true,
          message: 'Searched records found',
          code: HttpStatus.OK,
          data: response,
          paginationControl: paginationControl,
        };
      } else {
        const records = await this.getRepo().find({
          where: filter,
          relations,
        });
        return {
          success: true,
          code: HttpStatus.OK,
          data: records,
          message: 'Searched records found',
        };
      }
    } catch (ex) {
      this.logger.error(ex);
      throw ex;
    }
  }
}
