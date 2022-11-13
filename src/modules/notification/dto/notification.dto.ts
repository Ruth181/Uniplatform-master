import { Notification } from '@entities/notification.entity';
import { ApiProperty } from '@nestjs/swagger';
import { NotificationType } from '@utils/types/utils.constant';
import { BaseResponseTypeDTO } from '@utils/types/utils.types';

export class CreateNotificationDTO {
  @ApiProperty()
  userId: string;

  @ApiProperty()
  message: string;

  @ApiProperty({ enum: NotificationType })
  notificationType: NotificationType;
}

export class NotificationResponseDTO extends BaseResponseTypeDTO {
  @ApiProperty({ type: () => Notification })
  data: Notification;
}

export class NotificationsResponseDTO extends BaseResponseTypeDTO {
  @ApiProperty({ type: () => [Notification] })
  data: Notification[];
}
