import { GroupMember } from '@entities/group-member.entity';
import { Group } from '@entities/group.entity';
import { User } from '@entities/user.entity';
import { AuthModule } from '@modules/auth/auth.module';
import { GroupMemberModule } from '@modules/group-member/group-member.module';
import { GroupMemberService } from '@modules/group-member/group-member.service';
import { UserConnectionModule } from '@modules/user-connection/user-connection.module';
import { UserFollowerModule } from '@modules/user-follower/user-follower.module';
import { UserProfileModule } from '@modules/user-profile/user-profile.module';
import { UserModule } from '@modules/user/user.module';
import { UserService } from '@modules/user/user.service';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GroupController } from './group.controller';
import { GroupService } from './group.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Group, User, GroupMember]),
    UserModule,
    UserProfileModule,
    UserConnectionModule,
    UserFollowerModule,
    AuthModule,
    GroupMemberModule,
  ],
  controllers: [GroupController],
  providers: [GroupService, UserService, GroupMemberService],
  exports: [GroupService],
})
export class GroupModule {}
