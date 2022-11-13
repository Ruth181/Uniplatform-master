import { ArticleReaction } from '@entities/article-reaction.entity';
import { ArticleTag } from '@entities/article-tag.entity';
import { Article } from '@entities/article.entity';
import { UserInterest } from '@entities/user-interest.entity';
import { ArticleReactionModule } from '@modules/article-reaction/article-reaction.module';
import { ArticleReactionService } from '@modules/article-reaction/article-reaction.service';
import { ArticleTagModule } from '@modules/article-tag/article-tag.module';
import { ArticleTagService } from '@modules/article-tag/article-tag.service';
import { UserInterestModule } from '@modules/user-interest/user-interest.module';
import { UserInterestService } from '@modules/user-interest/user-interest.service';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArticleController } from './article.controller';
import { ArticleService } from './article.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Article,
      ArticleTag,
      ArticleReaction,
      UserInterest,
    ]),
    ArticleTagModule,
    ArticleReactionModule,
    UserInterestModule,
  ],
  controllers: [ArticleController],
  providers: [
    ArticleService,
    ArticleTagService,
    ArticleReactionService,
    UserInterestService,
  ],
  exports: [ArticleService],
})
export class ArticleModule {}
