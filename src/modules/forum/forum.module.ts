import { ForumReaction } from '@entities/forum-reaction.entity';
import { Forum } from '@entities/forum.entity';
import { ForumReactionModule } from '@modules/forum-reaction/forum-reaction.module';
import { ForumReactionService } from '@modules/forum-reaction/forum-reaction.service';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ForumController } from './forum.controller';
import { ForumService } from './forum.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Forum, ForumReaction]),
    ForumReactionModule,
  ],
  controllers: [ForumController],
  providers: [ForumService, ForumReactionService],
  exports: [ForumService],
})
export class ForumModule {}
