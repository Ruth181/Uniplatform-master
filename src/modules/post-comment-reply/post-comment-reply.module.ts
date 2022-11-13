import { PostCommentReply } from '@entities/post-comment-reply.entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostCommentReplyController } from './post-comment-reply.controller';
import { PostCommentReplyService } from './post-comment-reply.service';

@Module({
  imports: [TypeOrmModule.forFeature([PostCommentReply])],
  controllers: [PostCommentReplyController],
  providers: [PostCommentReplyService],
  exports: [PostCommentReplyService],
})
export class PostCommentReplyModule {}
