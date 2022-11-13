import { UsersResponseDTO } from '@modules/user/dto/user.dto';
import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
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
import { PaginationRequestType } from '@utils/types/utils.types';
import {
  CreateUserFollowerDTO,
  UserFollowerResponseDTO,
} from './dto/user-follower.dto';
import { UserFollowerService } from './user-follower.service';

@ApiBearerAuth('JWT')
@ApiTags('user-follower')
@Controller('user-follower')
@UseGuards(RolesGuard)
export class UserFollowerController {
  constructor(private readonly userFollowerSrv: UserFollowerService) {}

  @ApiOperation({ description: 'Follow a user' })
  @ApiProduces('json')
  @ApiResponse({ type: UserFollowerResponseDTO })
  @ApiConsumes('application/json')
  @Post()
  async createFollower(
    @Body() payload: CreateUserFollowerDTO,
    @CurrentUser(DecodedTokenKey.USER_ID) userId: string,
  ): Promise<UserFollowerResponseDTO> {
    return await this.userFollowerSrv.createFollower(payload, userId);
  }

  @ApiOperation({ description: 'Find followers for logged in user' })
  @ApiProduces('json')
  @ApiResponse({ type: UsersResponseDTO })
  @ApiConsumes('application/json')
  @Get('/find-my-followers')
  async findMyExistingConnections(
    @CurrentUser(DecodedTokenKey.USER_ID) userId: string,
    @Query() payload?: PaginationRequestType,
  ): Promise<UsersResponseDTO> {
    return await this.userFollowerSrv.findMyExistingFollowers(userId, payload);
  }

  @ApiOperation({ description: 'Search followers for logged in user' })
  @ApiProduces('json')
  @ApiResponse({ type: UsersResponseDTO })
  @ApiConsumes('application/json')
  @Get('/search-my-followers')
  async searchMyExistingFollowers(
    @Query('searchTerm') searchTerm: string,
    @CurrentUser(DecodedTokenKey.USER_ID) userId: string,
    @Query() payload?: PaginationRequestType,
  ): Promise<UsersResponseDTO> {
    return await this.userFollowerSrv.searchMyExistingFollowers(
      userId,
      searchTerm,
      payload,
    );
  }
}
