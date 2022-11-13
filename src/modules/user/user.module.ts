import { UserConnection } from '@entities/user-connection.entity';
import { UserFollower } from '@entities/user-follower.entity';
import { UserProfile } from '@entities/user-profile.entity';
import { User } from '@entities/user.entity';
import { AuthModule } from '@modules/auth/auth.module';
import { AuthService } from '@modules/auth/auth.service';
import { UserConnectionBlacklistModule } from '@modules/user-connection-blacklist/user-connection-blacklist.module';
import { UserConnectionModule } from '@modules/user-connection/user-connection.module';
import { UserConnectionService } from '@modules/user-connection/user-connection.service';
import { UserFollowerModule } from '@modules/user-follower/user-follower.module';
import { UserFollowerService } from '@modules/user-follower/user-follower.service';
import { UserProfileModule } from '@modules/user-profile/user-profile.module';
import { UserProfileService } from '@modules/user-profile/user-profile.service';
import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, UserProfile, UserFollower, UserConnection]),
    UserProfileModule,
    UserConnectionModule,
    UserFollowerModule,
    UserConnectionBlacklistModule,
    forwardRef(() => AuthModule),
  ],
  controllers: [UserController],
  providers: [
    UserService,
    UserProfileService,
    AuthService,
    UserFollowerService,
    UserConnectionService,
  ],
  exports: [UserService],
})
export class UserModule {}
