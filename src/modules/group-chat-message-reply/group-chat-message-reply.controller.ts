import {
  Body,
  Controller,
  Get,
  Param,
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
  ApiTags,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { RolesGuard } from '@schematics/guards/roles.guard';
import { PaginationRequestType } from '@utils/types/utils.types';
import {
  GroupChatMessageRepliesResponseDTO,
  GroupChatMessageReplyResponseDTO,
  SendGroupChatMessageReplyDTO,
} from './dto/group-chat-message.dto';
import { GroupChatMessageReplyService } from './group-chat-message-reply.service';

@ApiBearerAuth('JWT')
@UseGuards(RolesGuard)
@ApiTags('group-chat-message-reply')
@Controller('group-chat-message-reply')
export class GroupChatMessageReplyController {
  constructor(
    private readonly groupChatMessageReplySrv: GroupChatMessageReplyService,
  ) {}

  @ApiOperation({ description: 'Reply group-chat message' })
  @ApiProduces('json')
  @ApiResponse({ type: GroupChatMessageReplyResponseDTO })
  @ApiConsumes('application/json')
  @Post('/reply-group-chat-message')
  async sendReplyToGroupChatMessage(
    @Body() payload: SendGroupChatMessageReplyDTO,
  ): Promise<GroupChatMessageReplyResponseDTO> {
    return await this.groupChatMessageReplySrv.sendReplyToGroupChatMessage(
      payload,
    );
  }

  @ApiOperation({
    description: 'Find replies to messages by group-chat thread',
  })
  @ApiProduces('json')
  @ApiResponse({ type: GroupChatMessageRepliesResponseDTO })
  @ApiConsumes('application/json')
  @Get('/find-group-chat-message-thread/:groupChatMessageId')
  async findRepliesToGroupChatThread(
    @Param('groupChatMessageId', ParseUUIDPipe) groupChatMessageId: string,
    @Query() paginationPayload?: PaginationRequestType,
  ): Promise<GroupChatMessageRepliesResponseDTO> {
    return await this.groupChatMessageReplySrv.findRepliesToGroupChatThread(
      groupChatMessageId,
      paginationPayload,
    );
  }
}
