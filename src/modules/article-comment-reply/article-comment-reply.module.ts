import { ArticleCommentReply } from '@entities/article-comment-reply.entity';
import { ArticleComment } from '@entities/article-comment.entity';
import { User } from '@entities/user.entity';
import { ArticleCommentModule } from '@modules/article-comment/article-comment.module';
import { ArticleCommentService } from '@modules/article-comment/article-comment.service';
import { AuthModule } from '@modules/auth/auth.module';
import { UserConnectionModule } from '@modules/user-connection/user-connection.module';
import { UserFollowerModule } from '@modules/user-follower/user-follower.module';
import { UserProfileModule } from '@modules/user-profile/user-profile.module';
import { UserModule } from '@modules/user/user.module';
import { UserService } from '@modules/user/user.service';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArticleCommentReplyController } from './article-comment-reply.controller';
import { ArticleCommentReplyService } from './article-comment-reply.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([ArticleCommentReply, User, ArticleComment]),
    UserModule,
    ArticleCommentModule,
    UserProfileModule,
    UserConnectionModule,
    UserFollowerModule,
    AuthModule,
  ],
  controllers: [ArticleCommentReplyController],
  providers: [ArticleCommentReplyService, ArticleCommentService, UserService],
  exports: [ArticleCommentReplyService],
})
export class ArticleCommentReplyModule {}
