import { ForumAnswerReaction } from '@entities/forum-answer-reaction.entity';
import { ForumAnswer } from '@entities/forum-answer.entity';
import { ForumAnswerModule } from '@modules/forum-answer/forum-answer.module';
import { ForumAnswerService } from '@modules/forum-answer/forum-answer.service';
import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ForumAnswerReactionController } from './forum-answer-reaction.controller';
import { ForumAnswerReactionService } from './forum-answer-reaction.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([ForumAnswerReaction, ForumAnswer]),
    forwardRef(() => ForumAnswerModule),
  ],
  controllers: [ForumAnswerReactionController],
  providers: [ForumAnswerReactionService, ForumAnswerService],
  exports: [ForumAnswerReactionService],
})
export class ForumAnswerReactionModule {}
