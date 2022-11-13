import { ChatMessageReply } from '@entities/chat-message-reply.entity';
import { ChatMessage } from '@entities/chat-message.entity';
import { ChatRoom } from '@entities/chat-room.entity';
import { UserProfile } from '@entities/user-profile.entity';
import { ChatMessageReplyModule } from '@modules/chat-message-reply/chat-message-reply.module';
import { ChatMessageReplyService } from '@modules/chat-message-reply/chat-message-reply.service';
import { ChatRoomModule } from '@modules/chat-room/chat-room.module';
import { ChatRoomService } from '@modules/chat-room/chat-room.service';
import { UserProfileModule } from '@modules/user-profile/user-profile.module';
import { UserProfileService } from '@modules/user-profile/user-profile.service';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatMessageController } from './chat-message.controller';
import { ChatMessageGateway } from './chat-message.gateway';
import { ChatMessageService } from './chat-message.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ChatMessage,
      ChatMessageReply,
      ChatRoom,
      UserProfile,
    ]),
    ChatMessageReplyModule,
    UserProfileModule,
    ChatRoomModule,
  ],
  controllers: [ChatMessageController],
  providers: [
    ChatMessageService,
    ChatMessageReplyService,
    UserProfileService,
    ChatRoomService,
    ChatMessageGateway,
  ],
  exports: [ChatMessageService],
})
export class ChatMessageModule {}
