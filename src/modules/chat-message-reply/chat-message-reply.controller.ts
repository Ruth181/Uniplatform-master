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
  ApiBearerAuth,
  ApiConsumes,
  ApiOperation,
  ApiProduces,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { RolesGuard } from '@schematics/guards/roles.guard';
import { PaginationRequestType } from '@utils/types/utils.types';
import { ChatMessageReplyService } from './chat-message-reply.service';
import {
  SendChatMessageReplyDTO,
  ChatMessageReplyResponseDTO,
  ChatMessageRepliesResponseDTO,
} from './dto/chat-message-reply.dto';

@ApiBearerAuth('JWT')
@UseGuards(RolesGuard)
@ApiTags('chat-message-reply')
@Controller('chat-message-reply')
export class ChatMessageReplyController {
  constructor(private readonly chatMessageReplySrv: ChatMessageReplyService) {}

  @ApiOperation({ description: 'Reply chat message' })
  @ApiProduces('json')
  @ApiResponse({ type: ChatMessageReplyResponseDTO })
  @ApiConsumes('application/json')
  @Post('/reply-chat-message')
  async replyChatMessageReply(
    @Body() payload: SendChatMessageReplyDTO,
  ): Promise<ChatMessageReplyResponseDTO> {
    return await this.chatMessageReplySrv.createChatMessageReply(payload);
  }

  @ApiOperation({ description: 'Find replies to messages by chat thread' })
  @ApiProduces('json')
  @ApiResponse({ type: ChatMessageRepliesResponseDTO })
  @ApiConsumes('application/json')
  @Get('/find-chat-message-thread/:chatMessageId')
  async findRepliesToChatThread(
    @Param('chatMessageId', ParseUUIDPipe) chatMessageId: string,
    @Query() paginationPayload?: PaginationRequestType,
  ): Promise<ChatMessageRepliesResponseDTO> {
    return await this.chatMessageReplySrv.findRepliesToChatThread(
      chatMessageId,
      paginationPayload,
    );
  }
}
