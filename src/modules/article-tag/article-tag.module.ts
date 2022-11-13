import { ArticleTag } from '@entities/article-tag.entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArticleTagController } from './article-tag.controller';
import { ArticleTagService } from './article-tag.service';

@Module({
  imports: [TypeOrmModule.forFeature([ArticleTag])],
  controllers: [ArticleTagController],
  providers: [ArticleTagService],
  exports: [ArticleTagService],
})
export class ArticleTagModule {}
