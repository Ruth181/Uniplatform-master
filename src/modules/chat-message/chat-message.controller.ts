import { Controller, Post, Get, Body, UseGuards, Query } from '@nestjs/common';
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
import { ChatMessageService } from './chat-message.service';
import {
  SendChatMessageDTO,
  ChatMessageResponseDTO,
  FindMessageThreadDTO,
  ChatMessagesResponseDTO,
} from './dto/chat-message.dto';

@ApiBearerAuth('JWT')
@UseGuards(RolesGuard)
@ApiTags('chat-message')
@Controller('chat-message')
export class ChatMessageController {
  constructor(private readonly chatMessageSrv: ChatMessageService) {}

  @ApiOperation({ description: 'Send chat message' })
  @ApiProduces('json')
  @ApiResponse({ type: ChatMessageResponseDTO })
  @ApiConsumes('application/json')
  @Post('/send-message')
  async sendMessage(
    @Body() payload: SendChatMessageDTO,
  ): Promise<ChatMessageResponseDTO> {
    return await this.chatMessageSrv.sendMessage(payload);
  }

  @ApiOperation({ description: 'Find chat message thread' })
  @ApiProduces('json')
  @ApiResponse({ type: ChatMessagesResponseDTO })
  @ApiConsumes('application/json')
  @Get('/find-chat-message-thread')
  async findMessageThread(
    @Query() payload: FindMessageThreadDTO,
    @Query() paginationPayload?: PaginationRequestType,
  ): Promise<ChatMessagesResponseDTO> {
    return await this.chatMessageSrv.findMessageThread(
      payload,
      paginationPayload,
    );
  }
}
