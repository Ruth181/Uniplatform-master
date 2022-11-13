import { ArticleCommentLike } from '@entities/article-comment-like.entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArticleCommentLikeController } from './article-comment-like.controller';
import { ArticleCommentLikeService } from './article-comment-like.service';

@Module({
  imports: [TypeOrmModule.forFeature([ArticleCommentLike])],
  controllers: [ArticleCommentLikeController],
  providers: [ArticleCommentLikeService],
  exports: [ArticleCommentLikeService],
})
export class ArticleCommentLikeModule {}
