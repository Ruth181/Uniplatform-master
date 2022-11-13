import { UserInterest } from '@entities/user-interest.entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserInterestController } from './user-interest.controller';
import { UserInterestService } from './user-interest.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserInterest])],
  controllers: [UserInterestController],
  providers: [UserInterestService],
  exports: [UserInterestService],
})
export class UserInterestModule {}
