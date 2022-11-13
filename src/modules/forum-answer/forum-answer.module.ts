import { ForumAnswerReaction } from '@entities/forum-answer-reaction.entity';
import { ForumAnswer } from '@entities/forum-answer.entity';
import { ForumAnswerReactionModule } from '@modules/forum-answer-reaction/forum-answer-reaction.module';
import { ForumAnswerReactionService } from '@modules/forum-answer-reaction/forum-answer-reaction.service';
import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ForumAnswerController } from './forum-answer.controller';
import { ForumAnswerService } from './forum-answer.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([ForumAnswer, ForumAnswerReaction]),
    forwardRef(() => ForumAnswerReactionModule),
  ],
  controllers: [ForumAnswerController],
  providers: [ForumAnswerService, ForumAnswerReactionService],
  exports: [ForumAnswerService],
})
export class ForumAnswerModule {}
