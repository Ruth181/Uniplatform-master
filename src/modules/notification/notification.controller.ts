import {
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiConsumes,
  ApiOperation,
  ApiProduces,
  ApiResponse,
} from '@nestjs/swagger';
import { CurrentUser } from '@schematics/decorators/custom.decorator';
import { RolesGuard } from '@schematics/guards/roles.guard';
import { DecodedTokenKey } from '@utils/types/utils.constant';
import { BaseResponseTypeDTO } from '@utils/types/utils.types';
import { NotificationsResponseDTO } from './dto/notification.dto';
import { NotificationService } from './notification.service';

@ApiBearerAuth('JWT')
@ApiTags('notification')
@UseGuards(RolesGuard)
@Controller('notification')
export class NotificationController {
  constructor(private readonly notificationSrv: NotificationService) {}

  @ApiOperation({
    description: 'Find notifications for logged in user',
  })
  @ApiProduces('json')
  @ApiConsumes('application/json')
  @ApiResponse({ type: NotificationsResponseDTO })
  @Get('/find-user-notification')
  async findUserNotifications(
    @CurrentUser(DecodedTokenKey.USER_ID) userId: string,
  ): Promise<NotificationsResponseDTO> {
    return await this.notificationSrv.findUserNotifications(userId);
  }

  @ApiOperation({
    description: "Mark a notification as 'read'",
  })
  @ApiProduces('json')
  @ApiConsumes('application/json')
  @ApiResponse({ type: BaseResponseTypeDTO })
  @Delete('/mark-as-read/:notificationId')
  async markAsIsRead(
    @Param('notificationId', ParseUUIDPipe) notificationId: string,
  ): Promise<BaseResponseTypeDTO> {
    return await this.notificationSrv.markAsIsRead(notificationId);
  }
}
