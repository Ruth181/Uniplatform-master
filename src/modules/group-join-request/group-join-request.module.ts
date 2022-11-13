import { GroupJoinRequest } from '@entities/group-join-request.entity';
import { GroupMember } from '@entities/group-member.entity';
import { GroupMemberModule } from '@modules/group-member/group-member.module';
import { GroupMemberService } from '@modules/group-member/group-member.service';
import { GroupModule } from '@modules/group/group.module';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GroupJoinRequestController } from './group-join-request.controller';
import { GroupJoinRequestService } from './group-join-request.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([GroupJoinRequest, GroupMember]),
    GroupMemberModule,
    GroupModule,
  ],
  controllers: [GroupJoinRequestController],
  providers: [GroupJoinRequestService, GroupMemberService],
  exports: [GroupJoinRequestService],
})
export class GroupJoinRequestModule {}
