import { UserSetting } from '@entities/user-setting.entity';
import {
  Injectable,
  HttpStatus,
  NotFoundException,
  NotImplementedException,
} from '@nestjs/common';
import { GenericService } from '@schematics/services/generic.service';
import { checkForRequiredFields } from '@utils/functions/utils.function';
import {
  CreateUserSettingDTO,
  UserSettingResponseDTO,
} from './dto/user-setting.dto';

@Injectable()
export class UserSettingService extends GenericService(UserSetting) {
  //check if user setting already exists if it does update if not create
  async setUserSetting(
    payload: CreateUserSettingDTO,
    userId: string,
  ): Promise<UserSettingResponseDTO> {
    try {
      checkForRequiredFields(['userId'], payload);
      const ifUserSettingExists = await this.getRepo().findOne({
        where: [{ userId }],
      });
      if (!ifUserSettingExists?.id) {
        const userSetting: UserSetting = await this.create<
          Partial<UserSetting>
        >({
          userId,
          ...payload,
        });
        if (!userSetting?.id) {
          throw new NotImplementedException('REQUEST WAS NOT SUCCESSFUL');
        }
      } else {
        await this.getRepo().update({ userId }, payload);
      }
      return {
        code: HttpStatus.OK,
        message: 'UPDATE SUCCESSFUL',
        success: true,
      };
    } catch (ex) {
      throw ex;
    }
  }

  async findUserSetting(userId: string): Promise<UserSettingResponseDTO> {
    try {
      const userSetting: UserSetting = await this.getRepo().findOne({
        where: [{ userId }],
      });
      if (!userSetting) {
        throw new NotFoundException('NO SETTING FOR THIS USER');
      }

      return {
        code: HttpStatus.OK,
        message: 'USER SETTING FOUND',
        data: userSetting,
        success: true,
      };
    } catch (ex) {
      throw ex;
    }
  }
}
