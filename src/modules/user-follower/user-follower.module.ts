import { UserFollower } from '@entities/user-follower.entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserFollowerController } from './user-follower.controller';
import { UserFollowerService } from './user-follower.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserFollower])],
  controllers: [UserFollowerController],
  providers: [UserFollowerService],
  exports: [UserFollowerService],
})
export class UserFollowerModule {}
