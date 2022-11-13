import { UserFollowerBlacklist } from '@entities/user-follower-blacklist.entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserFollowerBlacklistController } from './user-follower-blacklist.controller';
import { UserFollowerBlacklistService } from './user-follower-blacklist.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserFollowerBlacklist])],
  controllers: [UserFollowerBlacklistController],
  providers: [UserFollowerBlacklistService],
  exports: [UserFollowerBlacklistService],
})
export class UserFollowerBlacklistModule {}
