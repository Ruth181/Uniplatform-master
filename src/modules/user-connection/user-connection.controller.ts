import { UsersResponseDTO } from '@modules/user/dto/user.dto';
import { Body, Get, Controller, Post, Query, UseGuards } from '@nestjs/common';
import {
  ApiOperation,
  ApiProduces,
  ApiResponse,
  ApiConsumes,
  ApiBearerAuth,
  ApiTags,
} from '@nestjs/swagger';
import { CurrentUser } from '@schematics/decorators/custom.decorator';
import { RolesGuard } from '@schematics/guards/roles.guard';
import { DecodedTokenKey } from '@utils/types/utils.constant';
import { PaginationRequestType } from '@utils/types/utils.types';
import {
  CreateUserConnectionDTO,
  UserConnectionResponseDTO,
} from './dto/user-connection.dto';
import { UserConnectionService } from './user-connection.service';

@ApiBearerAuth('JWT')
@ApiTags('user-connection')
@Controller('user-connection')
@UseGuards(RolesGuard)
export class UserConnectionController {
  constructor(private readonly userConnectionSrv: UserConnectionService) {}

  @ApiOperation({ description: 'Connect with a user' })
  @ApiProduces('json')
  @ApiResponse({ type: UserConnectionResponseDTO })
  @ApiConsumes('application/json')
  @Post()
  async createFollower(
    @Body() payload: CreateUserConnectionDTO,
    @CurrentUser(DecodedTokenKey.USER_ID) userId: string,
  ): Promise<UserConnectionResponseDTO> {
    return await this.userConnectionSrv.createConnection(payload, userId);
  }

  @ApiOperation({ description: 'Find connections for logged in user' })
  @ApiProduces('json')
  @ApiResponse({ type: UsersResponseDTO })
  @ApiConsumes('application/json')
  @Get('/find-my-connections')
  async findMyExistingConnections(
    @CurrentUser(DecodedTokenKey.USER_ID) userId: string,
    @Query() payload?: PaginationRequestType,
  ): Promise<UsersResponseDTO> {
    return await this.userConnectionSrv.findMyExistingConnections(
      userId,
      payload,
    );
  }

  @ApiOperation({ description: 'search connections for logged in user' })
  @ApiProduces('json')
  @ApiResponse({ type: UsersResponseDTO })
  @ApiConsumes('application/json')
  @Get('/search-my-connections')
  async searchMyExistingConnections(
    @Query('searchTerm') searchTerm: string,
    @CurrentUser(DecodedTokenKey.USER_ID) userId: string,
    @Query() payload?: PaginationRequestType,
  ): Promise<UsersResponseDTO> {
    return await this.userConnectionSrv.searchMyExistingConnections(
      userId,
      searchTerm,
      payload,
    );
  }

  @ApiOperation({ description: 'Find available connections for a user' })
  @ApiProduces('json')
  @ApiResponse({ type: UserConnectionResponseDTO })
  @ApiConsumes('application/json')
  @Get('/user/find-available-connections')
  async findAvailableConnections(
    @CurrentUser(DecodedTokenKey.USER_ID) userId: string,
    @Query() payload?: PaginationRequestType,
  ): Promise<UsersResponseDTO> {
    return await this.userConnectionSrv.findAvailableConnections(
      userId,
      payload,
    );
  }

  @ApiOperation({ description: 'Find available friends to connect with' })
  @ApiProduces('json')
  @ApiResponse({ type: UserConnectionResponseDTO })
  @ApiConsumes('application/json')
  @Get('/user/find-available-friends')
  async findAvailableFriends(
    @CurrentUser(DecodedTokenKey.USER_ID) userId: string,
    @Query() payload?: PaginationRequestType,
  ): Promise<UsersResponseDTO> {
    return await this.userConnectionSrv.findAvailableFriends(userId, payload);
  }
}
