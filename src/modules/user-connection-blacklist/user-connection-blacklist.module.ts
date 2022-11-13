import { UserConnectionBlacklist } from '@entities/user-connection-blacklist.entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserConnectionBlacklistController } from './user-connection-blacklist.controller';
import { UserConnectionBlacklistService } from './user-connection-blacklist.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserConnectionBlacklist])],
  controllers: [UserConnectionBlacklistController],
  providers: [UserConnectionBlacklistService],
  exports: [UserConnectionBlacklistService],
})
export class UserConnectionBlacklistModule {}
