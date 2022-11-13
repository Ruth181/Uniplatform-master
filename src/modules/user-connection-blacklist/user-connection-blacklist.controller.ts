import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiOperation,
  ApiProduces,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CurrentUser } from '@schematics/decorators/custom.decorator';
import { RolesGuard } from '@schematics/guards/roles.guard';
import { DecodedTokenKey } from '@utils/types/utils.constant';
import {
  BaseResponseTypeDTO,
  PaginationRequestType,
} from '@utils/types/utils.types';
import {
  BlacklistUserConnectionDTO,
  UserConnectionBlacklistResponseDTO,
  UserConnectionBlacklistsResponseDTO,
} from './dto/user-connection-blacklist.dto';
import { UserConnectionBlacklistService } from './user-connection-blacklist.service';

@ApiBearerAuth('JWT')
@UseGuards(RolesGuard)
@ApiTags('user-connection-blacklist')
@Controller('user-connection-blacklist')
export class UserConnectionBlacklistController {
  constructor(
    private readonly userConnectionBlacklistSrv: UserConnectionBlacklistService,
  ) {}

  @ApiOperation({ description: 'Blacklist potential connection' })
  @ApiProduces('json')
  @ApiConsumes('application/json')
  @ApiResponse({ type: () => UserConnectionBlacklistResponseDTO })
  @Post()
  async blackListPotentialConnection(
    @CurrentUser(DecodedTokenKey.USER_ID) userId: string,
    @Body() payload: BlacklistUserConnectionDTO,
  ): Promise<UserConnectionBlacklistResponseDTO> {
    return await this.userConnectionBlacklistSrv.blackListPotentialConnection(
      payload,
      userId,
    );
  }

  @ApiOperation({
    description: 'View list of all users blacklisted by current user',
  })
  @ApiProduces('json')
  @ApiConsumes('application/json')
  @ApiResponse({ type: () => UserConnectionBlacklistsResponseDTO })
  @Get('/view-my-connection-blacklist')
  async findListOfMyBlacklistedUserConnections(
    @CurrentUser(DecodedTokenKey.USER_ID) userId: string,
    @Query() payload?: PaginationRequestType,
  ): Promise<UserConnectionBlacklistsResponseDTO> {
    return await this.userConnectionBlacklistSrv.findListOfMyBlacklistedUserConnections(
      userId,
      payload,
    );
  }

  @ApiOperation({ description: 'Delete blacklisted potential connection' })
  @ApiProduces('json')
  @ApiConsumes('application/json')
  @ApiResponse({ type: () => BaseResponseTypeDTO })
  @Delete('/remove-user-from-my-blacklist')
  async deleteConnectionFromBlacklist(
    @CurrentUser(DecodedTokenKey.USER_ID) userId: string,
    @Body() blacklistedUserIds: string[],
  ): Promise<BaseResponseTypeDTO> {
    return await this.userConnectionBlacklistSrv.deleteConnectionsFromBlacklist(
      userId,
      blacklistedUserIds,
    );
  }
}
