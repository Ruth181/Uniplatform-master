import {
  Body,
  Controller,
  Get,
  ParseUUIDPipe,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiOperation,
  ApiProduces,
  ApiResponse,
  ApiConsumes,
  ApiBearerAuth,
  ApiTags,
} from '@nestjs/swagger';
import { RolesGuard } from '@schematics/guards/roles.guard';
import { PaginationRequestType } from '@utils/types/utils.types';
import {
  SendGroupChatMessageDTO,
  GroupChatMessageResponseDTO,
  GroupChatMessagesResponseDTO,
  GroupChatFilterTypeDTO,
} from './dto/group-chat.dto';
import { GroupChatMessageService } from './group-chat.service';

@ApiBearerAuth('JWT')
@UseGuards(RolesGuard)
@ApiTags('group-chat-message')
@Controller('group-chat-message')
export class GroupChatMessageController {
  constructor(private readonly groupChatMessageSrv: GroupChatMessageService) {}

  @ApiOperation({ description: 'Send chat group message' })
  @ApiProduces('json')
  @ApiResponse({ type: GroupChatMessageResponseDTO })
  @ApiConsumes('application/json')
  @Post('/send-message')
  async sendGroupMessage(
    @Body() payload: SendGroupChatMessageDTO,
  ): Promise<GroupChatMessageResponseDTO> {
    return await this.groupChatMessageSrv.sendGroupMessage(payload);
  }

  @ApiOperation({ description: 'Find group chat message thread' })
  @ApiProduces('json')
  @ApiResponse({ type: GroupChatMessagesResponseDTO })
  @ApiConsumes('application/json')
  @Get('/find-chat-message-thread')
  async findGroupMessageThread(
    @Query('groupId', ParseUUIDPipe) groupId: string,
    @Query() paginationPayload?: PaginationRequestType,
  ): Promise<GroupChatMessagesResponseDTO> {
    return await this.groupChatMessageSrv.findGroupMessageThread(
      groupId,
      paginationPayload,
    );
  }

  @ApiOperation({
    description:
      'Filter group chat message thread by type, Can be used to filter group media',
  })
  @ApiProduces('json')
  @ApiResponse({ type: GroupChatMessagesResponseDTO })
  @ApiConsumes('application/json')
  @Get('/filter/find-chat-message-thread-by-type')
  async filterGroupMessagesByType(
    @Query() payload: GroupChatFilterTypeDTO,
    @Query() paginationPayload?: PaginationRequestType,
  ): Promise<GroupChatMessagesResponseDTO> {
    return await this.groupChatMessageSrv.filterGroupMessagesByType(
      payload,
      paginationPayload,
    );
  }
}
