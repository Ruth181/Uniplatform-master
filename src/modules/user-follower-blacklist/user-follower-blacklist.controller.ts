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
  BlacklistUserFollowerDTO,
  UserFollowerBlacklistResponseDTO,
  UserFollowerBlacklistsResponseDTO,
} from './dto/user-follower-blacklist.dto';
import { UserFollowerBlacklistService } from './user-follower-blacklist.service';

@ApiBearerAuth('JWT')
@UseGuards(RolesGuard)
@ApiTags('user-follower-blacklist')
@Controller('user-follower-blacklist')
export class UserFollowerBlacklistController {
  constructor(
    private readonly userFollowerBlacklistSrv: UserFollowerBlacklistService,
  ) {}

  @ApiOperation({ description: 'Blacklist potential follower' })
  @ApiProduces('json')
  @ApiConsumes('application/json')
  @ApiResponse({ type: () => UserFollowerBlacklistResponseDTO })
  @Post()
  async blackListPotentialFollower(
    @CurrentUser(DecodedTokenKey.USER_ID) userId: string,
    @Body() payload: BlacklistUserFollowerDTO,
  ): Promise<UserFollowerBlacklistResponseDTO> {
    return await this.userFollowerBlacklistSrv.blackListPotentialFollower(
      payload,
      userId,
    );
  }

  @ApiOperation({
    description: 'View list of all users blacklisted by current user',
  })
  @ApiProduces('json')
  @ApiConsumes('application/json')
  @ApiResponse({ type: () => UserFollowerBlacklistsResponseDTO })
  @Get('/view-my-follower-blacklist')
  async findListOfMyBlacklistedUserConnections(
    @CurrentUser(DecodedTokenKey.USER_ID) userId: string,
    @Query() payload?: PaginationRequestType,
  ): Promise<UserFollowerBlacklistsResponseDTO> {
    return await this.userFollowerBlacklistSrv.findListOfMyBlacklistedUserFollowers(
      userId,
      payload,
    );
  }

  @ApiOperation({ description: 'Delete blacklisted potential connection' })
  @ApiProduces('json')
  @ApiConsumes('application/json')
  @ApiResponse({ type: () => BaseResponseTypeDTO })
  @Delete('/remove-user-from-my-blacklist')
  async deleteFollowerFromBlacklist(
    @CurrentUser(DecodedTokenKey.USER_ID) userId: string,
    @Body() blacklistedUserIds: string[],
  ): Promise<BaseResponseTypeDTO> {
    return await this.userFollowerBlacklistSrv.deleteFollowersFromBlacklist(
      userId,
      blacklistedUserIds,
    );
  }
}
