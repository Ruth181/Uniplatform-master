import { ApiProperty } from '@nestjs/swagger';
import { UserSetting } from '@entities/user-setting.entity';
import { BaseResponseTypeDTO } from '@utils/types/utils.types';

export class CreateUserSettingDTO {
  @ApiProperty({ type: Boolean })
  canReceiveNotifications: boolean;

  @ApiProperty({ type: Boolean })
  canReceiveEmailUpdates: boolean;
}

export class UserSettingResponseDTO extends BaseResponseTypeDTO {
  @ApiProperty({ type: () => UserSetting })
  data?: UserSetting;
}
