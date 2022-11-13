import { Controller, UseGuards, Post, Body, Get } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiProduces,
} from '@nestjs/swagger';
import { CurrentUser } from '@schematics/decorators/custom.decorator';
import { RolesGuard } from '@schematics/guards/roles.guard';
import { DecodedTokenKey } from '@utils/types/utils.constant';
import {
  CreateUserSettingDTO,
  UserSettingResponseDTO,
} from './dto/user-setting.dto';
import { UserSettingService } from './user-setting.service';

@ApiBearerAuth('JWT')
@ApiTags('user-setting')
@UseGuards(RolesGuard)
@Controller('user-setting')
export class UserSettingController {
  constructor(private readonly userSettingSrv: UserSettingService) {}

  @Post()
  @ApiOperation({ description: 'Create or update user setting' })
  @ApiConsumes('application/json')
  @ApiProduces('json')
  @ApiResponse({ type: () => UserSettingResponseDTO })
  async userSetting(
    @Body() payload: CreateUserSettingDTO,
    @CurrentUser(DecodedTokenKey.USER_ID) userId: string,
  ): Promise<UserSettingResponseDTO> {
    return await this.userSettingSrv.setUserSetting(payload, userId);
  }

  @Get()
  @ApiOperation({ description: 'Get user setting' })
  @ApiProduces('json')
  @ApiResponse({ type: () => UserSettingResponseDTO })
  async findUserSetting(
    @CurrentUser(DecodedTokenKey.USER_ID) userId: string,
  ): Promise<UserSettingResponseDTO> {
    return await this.userSettingSrv.findUserSetting(userId);
  }
}
