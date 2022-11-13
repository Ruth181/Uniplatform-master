import { GroupChatMessageReply } from '@entities/group-chat-message-reply.entity';
import { GroupMember } from '@entities/group-member.entity';
import { GroupMemberModule } from '@modules/group-member/group-member.module';
import { GroupMemberService } from '@modules/group-member/group-member.service';
import { GroupModule } from '@modules/group/group.module';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GroupChatMessageReplyController } from './group-chat-message-reply.controller';
import { GroupChatMessageReplyService } from './group-chat-message-reply.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([GroupChatMessageReply, GroupMember]),
    GroupMemberModule,
    GroupModule,
  ],
  controllers: [GroupChatMessageReplyController],
  providers: [GroupChatMessageReplyService, GroupMemberService],
  exports: [GroupChatMessageReplyService],
})
export class GroupChatMessageReplyModule {}
