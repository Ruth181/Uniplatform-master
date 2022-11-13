import { Interest } from '@entities/interest.entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InterestController } from './interest.controller';
import { InterestService } from './interest.service';

@Module({
  imports: [TypeOrmModule.forFeature([Interest])],
  controllers: [InterestController],
  providers: [InterestService],
  exports: [InterestService],
})
export class InterestModule {}
