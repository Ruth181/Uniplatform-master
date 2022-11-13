import { ArticleReaction } from '@entities/article-reaction.entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArticleReactionController } from './article-reaction.controller';
import { ArticleReactionService } from './article-reaction.service';

@Module({
  imports: [TypeOrmModule.forFeature([ArticleReaction])],
  controllers: [ArticleReactionController],
  providers: [ArticleReactionService],
  exports: [ArticleReactionService],
})
export class ArticleReactionModule {}
