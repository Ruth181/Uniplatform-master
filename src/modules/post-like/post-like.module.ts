import { PostLike } from '@entities/post-like.entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostLikeController } from './post-like.controller';
import { PostLikeService } from './post-like.service';

@Module({
  imports: [TypeOrmModule.forFeature([PostLike])],
  controllers: [PostLikeController],
  providers: [PostLikeService],
  exports: [PostLikeService],
})
export class PostLikeModule {}
