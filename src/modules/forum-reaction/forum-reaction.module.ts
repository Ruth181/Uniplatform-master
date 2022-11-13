import { ForumReaction } from '@entities/forum-reaction.entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ForumReactionController } from './forum-reaction.controller';
import { ForumReactionService } from './forum-reaction.service';

@Module({
  imports: [TypeOrmModule.forFeature([ForumReaction])],
  controllers: [ForumReactionController],
  providers: [ForumReactionService],
  exports: [ForumReactionService],
})
export class ForumReactionModule {}
