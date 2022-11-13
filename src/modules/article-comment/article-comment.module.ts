import { ArticleComment } from '@entities/article-comment.entity';
import { User } from '@entities/user.entity';
import { AuthModule } from '@modules/auth/auth.module';
import { UserConnectionModule } from '@modules/user-connection/user-connection.module';
import { UserFollowerModule } from '@modules/user-follower/user-follower.module';
import { UserProfileModule } from '@modules/user-profile/user-profile.module';
import { UserModule } from '@modules/user/user.module';
import { UserService } from '@modules/user/user.service';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArticleCommentController } from './article-comment.controller';
import { ArticleCommentService } from './article-comment.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([ArticleComment, User]),
    UserModule,
    UserProfileModule,
    UserConnectionModule,
    UserFollowerModule,
    AuthModule,
  ],
  controllers: [ArticleCommentController],
  providers: [ArticleCommentService, UserService],
  exports: [ArticleCommentService],
})
export class ArticleCommentModule {}
