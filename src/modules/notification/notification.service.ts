import { Notification } from '@entities/notification.entity';
import {
  BadRequestException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { GenericService } from '@schematics/services/generic.service';
import { BaseResponseTypeDTO } from '@utils/types/utils.types';
import {
  CreateNotificationDTO,
  NotificationResponseDTO,
  NotificationsResponseDTO,
} from './dto/notification.dto';

@Injectable()
export class NotificationService extends GenericService(Notification) {
  @OnEvent('notification.created', { async: true })
  async createNotification(
    payload: CreateNotificationDTO,
  ): Promise<NotificationResponseDTO> {
    try {
      const recordFound = await this.findOne({
        message: payload.message.toUpperCase(),
        userId: payload.userId,
      });
      if (!recordFound?.id) {
        const createdRecord = await this.create<Partial<Notification>>(payload);
        return {
          success: true,
          code: HttpStatus.CREATED,
          data: createdRecord,
          message: 'Created',
        };
      }
    } catch (ex) {
      this.logger.error(ex);
      throw ex;
    }
  }

  async findUserNotifications(
    userId: string,
    status = true,
  ): Promise<NotificationsResponseDTO> {
    try {
      if (!userId) {
        throw new BadRequestException('Field userId is required');
      }
      const records = await this.getRepo().find({
        where: { userId, status },
        relations: ['user'],
      });
      return {
        success: true,
        code: HttpStatus.OK,
        data: records,
        message: 'Records found',
      };
    } catch (ex) {
      this.logger.error(ex);
      throw ex;
    }
  }

  async markAsIsRead(notificationId: string): Promise<BaseResponseTypeDTO> {
    try {
      if (!notificationId) {
        throw new BadRequestException('Field notificationId is required');
      }
      const recordFound = await this.findOne({ id: notificationId });
      if (!recordFound?.id) {
        throw new NotFoundException();
      }
      await this.getRepo().update({ id: recordFound.id }, { status: false });
      return {
        success: true,
        code: HttpStatus.OK,
        message: 'Updated',
      };
    } catch (ex) {
      this.logger.error(ex);
      throw ex;
    }
  }
}
