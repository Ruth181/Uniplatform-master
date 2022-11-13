import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
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
  CreateJoinGroupRequestDTO,
  GroupJoinRequestResponseDTO,
  GroupJoinRequestsResponseDTO,
} from './dto/group-join-request.dto';
import { GroupJoinRequestService } from './group-join-request.service';

@ApiBearerAuth('JWT')
@UseGuards(RolesGuard)
@ApiTags('group-join-request')
@Controller('group-join-request')
export class GroupJoinRequestController {
  constructor(private readonly groupJoinRequestSrv: GroupJoinRequestService) {}

  @ApiOperation({ description: 'Make request to join group' })
  @ApiProduces('json')
  @ApiResponse({ type: GroupJoinRequestResponseDTO })
  @ApiConsumes('application/json')
  @Post('/make-request-to-join-group')
  async makeRequestToJoinGroup(
    @Body() payload: CreateJoinGroupRequestDTO,
    @CurrentUser(DecodedTokenKey.USER_ID) userId: string,
  ): Promise<GroupJoinRequestResponseDTO> {
    return await this.groupJoinRequestSrv.makeRequestToJoinGroup(
      payload,
      userId,
    );
  }

  @ApiOperation({ description: 'Find and view requests to join a group' })
  @ApiProduces('json')
  @ApiResponse({ type: GroupJoinRequestsResponseDTO })
  @ApiConsumes('application/json')
  @Get('/find-requests-to-join-group/:groupId')
  async findJoinRequestListByGroupId(
    @Param('groupId', ParseUUIDPipe) groupId: string,
    @Query() paginationPayload?: PaginationRequestType,
  ): Promise<GroupJoinRequestsResponseDTO> {
    return await this.groupJoinRequestSrv.findJoinRequestListByGroupId(
      groupId,
      paginationPayload,
    );
  }

  @ApiOperation({ description: 'Accept group requests' })
  @ApiProduces('json')
  @ApiResponse({ type: BaseResponseTypeDTO })
  @ApiConsumes('application/json')
  @Post('/accept/group-requests')
  async acceptGroupRequests(
    @Body() groupInviteIds: string[],
  ): Promise<BaseResponseTypeDTO> {
    return await this.groupJoinRequestSrv.acceptGroupRequests(groupInviteIds);
  }

  @ApiOperation({ description: 'Decline group requests' })
  @ApiProduces('json')
  @ApiResponse({ type: BaseResponseTypeDTO })
  @ApiConsumes('application/json')
  @Delete()
  async rejectGroupJoinRequest(
    @Body() groupInviteIds: string[],
  ): Promise<BaseResponseTypeDTO> {
    return await this.groupJoinRequestSrv.rejectGroupJoinRequest(
      groupInviteIds,
    );
  }
}
