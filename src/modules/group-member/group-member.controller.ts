import { GroupsResponseDTO } from '@modules/group/dto/group.dto';
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
  CreateGroupMemberDTO,
  GroupMemberResponseDTO,
} from './dto/group-member.dto';
import { GroupMemberService } from './group-member.service';

@ApiBearerAuth('JWT')
@UseGuards(RolesGuard)
@ApiTags('group-member')
@Controller('group-member')
export class GroupMemberController {
  constructor(private readonly groupMemberSrv: GroupMemberService) {}

  @ApiOperation({ description: 'Join group' })
  @ApiProduces('json')
  @ApiResponse({ type: GroupMemberResponseDTO })
  @ApiConsumes('application/json')
  @Post('/join-group')
  async joinGroup(
    @Body() payload: CreateGroupMemberDTO,
    @CurrentUser(DecodedTokenKey.USER_ID) userId: string,
  ): Promise<GroupMemberResponseDTO> {
    return await this.groupMemberSrv.joinGroup(payload, userId);
  }

  @ApiOperation({ description: 'Find groups for currently logged in user' })
  @ApiProduces('json')
  @ApiResponse({ type: GroupsResponseDTO })
  @ApiConsumes('application/json')
  @Get('/find-my-groups')
  async findMyGroups(
    @CurrentUser(DecodedTokenKey.USER_ID) userId: string,
    @Query() paginationPayload?: PaginationRequestType,
  ): Promise<GroupsResponseDTO> {
    return await this.groupMemberSrv.findMyGroups(userId, paginationPayload);
  }

  @ApiOperation({
    description: 'Search groups which logged in user is a member',
  })
  @ApiProduces('json')
  @ApiResponse({ type: GroupsResponseDTO })
  @ApiConsumes('application/json')
  @Get('/search-my-groups')
  async searchForMyGroups(
    @Query('searchTerm') searchTerm: string,
    @CurrentUser(DecodedTokenKey.USER_ID) userId: string,
    @Query() paginationPayload?: PaginationRequestType,
  ): Promise<GroupsResponseDTO> {
    return await this.groupMemberSrv.searchForMyGroups(
      searchTerm,
      userId,
      paginationPayload,
    );
  }
}
