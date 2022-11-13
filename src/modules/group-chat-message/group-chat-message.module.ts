import { GroupChatMessage } from '@entities/group-chat-message.entity';
import { GroupMember } from '@entities/group-member.entity';
import { UserProfile } from '@entities/user-profile.entity';
import { GroupMemberModule } from '@modules/group-member/group-member.module';
import { GroupMemberService } from '@modules/group-member/group-member.service';
import { GroupModule } from '@modules/group/group.module';
import { UserProfileModule } from '@modules/user-profile/user-profile.module';
import { UserProfileService } from '@modules/user-profile/user-profile.service';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GroupChatMessageController } from './group-chat-message.controller';
import { GroupChatMessageGateway } from './group-chat-message.gateway';
import { GroupChatMessageService } from './group-chat.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([GroupChatMessage, GroupMember, UserProfile]),
    GroupMemberModule,
    GroupModule,
    UserProfileModule,
  ],
  controllers: [GroupChatMessageController],
  providers: [
    GroupChatMessageService,
    GroupMemberService,
    GroupChatMessageGateway,
    UserProfileService,
  ],
  exports: [GroupChatMessageService],
})
export class GroupChatMessageModule {}
