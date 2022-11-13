import { ChatMessageReply } from '@entities/chat-message-reply.entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatMessageReplyController } from './chat-message-reply.controller';
import { ChatMessageReplyService } from './chat-message-reply.service';

@Module({
  imports: [TypeOrmModule.forFeature([ChatMessageReply])],
  controllers: [ChatMessageReplyController],
  providers: [ChatMessageReplyService],
  exports: [ChatMessageReplyService],
})
export class ChatMessageReplyModule {}
