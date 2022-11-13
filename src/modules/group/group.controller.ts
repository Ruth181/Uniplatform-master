import {
  Controller,
  Body,
  Post,
  Get,
  UseGuards,
  Query,
  Param,
  ParseUUIDPipe,
  Patch,
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
  CreateGroupDTO,
  GroupResponseDTO,
  GroupsResponseDTO,
  UpdateGroupDTO,
} from './dto/group.dto';
import { GroupService } from './group.service';

@ApiBearerAuth('JWT')
@UseGuards(RolesGuard)
@ApiTags('group')
@Controller('group')
export class GroupController {
  constructor(private readonly groupSrv: GroupService) {}

  @ApiOperation({ description: 'Create a group/channel' })
  @ApiProduces('json')
  @ApiResponse({ type: GroupResponseDTO })
  @ApiConsumes('application/json')
  @Post()
  async createGroup(
    @Body() payload: CreateGroupDTO,
    @CurrentUser(DecodedTokenKey.USER_ID) userId: string,
  ): Promise<GroupResponseDTO> {
    return await this.groupSrv.createGroup(payload, userId);
  }

  @ApiOperation({ description: 'Find suggested groups' })
  @ApiProduces('json')
  @ApiResponse({ type: GroupsResponseDTO })
  @ApiConsumes('application/json')
  @Get('/find-suggested-groups')
  async findSuggestedGroups(
    @CurrentUser(DecodedTokenKey.USER_ID) userId: string,
    @Query() paginationPayload?: PaginationRequestType,
  ): Promise<GroupsResponseDTO> {
    return await this.groupSrv.findSuggestedGroups(userId, paginationPayload);
  }

  @ApiOperation({ description: 'Get all groups ordered by creation date' })
  @ApiProduces('json')
  @ApiResponse({ type: GroupsResponseDTO })
  @ApiConsumes('application/json')
  @Get()
  async findGroups(
    @Query() paginationPayload?: PaginationRequestType,
  ): Promise<GroupsResponseDTO> {
    return await this.groupSrv.findGroups(true, paginationPayload);
  }

  @ApiOperation({ description: 'Get group by id' })
  @ApiProduces('json')
  @ApiResponse({ type: GroupResponseDTO })
  @ApiConsumes('application/json')
  @Get('/:groupId')
  async findGroupById(
    @Param('groupId', ParseUUIDPipe) groupId: string,
  ): Promise<GroupResponseDTO> {
    return await this.groupSrv.findGroupById(groupId);
  }

  @ApiOperation({ description: 'Update group' })
  @ApiProduces('json')
  @ApiResponse({ type: BaseResponseTypeDTO })
  @ApiConsumes('application/json')
  @Patch()
  async updateGroup(
    @Body() payload: UpdateGroupDTO,
  ): Promise<BaseResponseTypeDTO> {
    return await this.groupSrv.updateGroup(payload);
  }
}
