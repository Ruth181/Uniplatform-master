import { UserConnectionBlacklist } from '@entities/user-connection-blacklist.entity';
import { UserConnection } from '@entities/user-connection.entity';
import { UserFollower } from '@entities/user-follower.entity';
import { UserProfile } from '@entities/user-profile.entity';
import { UserConnectionBlacklistModule } from '@modules/user-connection-blacklist/user-connection-blacklist.module';
import { UserConnectionBlacklistService } from '@modules/user-connection-blacklist/user-connection-blacklist.service';
import { UserFollowerModule } from '@modules/user-follower/user-follower.module';
import { UserFollowerService } from '@modules/user-follower/user-follower.service';
import { UserProfileModule } from '@modules/user-profile/user-profile.module';
import { UserProfileService } from '@modules/user-profile/user-profile.service';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserConnectionController } from './user-connection.controller';
import { UserConnectionService } from './user-connection.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserConnection,
      UserProfile,
      UserFollower,
      UserConnectionBlacklist,
    ]),
    UserProfileModule,
    UserFollowerModule,
    UserConnectionBlacklistModule,
  ],
  controllers: [UserConnectionController],
  providers: [
    UserConnectionService,
    UserProfileService,
    UserFollowerService,
    UserConnectionBlacklistService,
  ],
  exports: [UserConnectionService],
})
export class UserConnectionModule {}
