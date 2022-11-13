import { AuthModule } from '@modules/auth/auth.module';
import { Module, DynamicModule } from '@nestjs/common';
import { APP_INTERCEPTOR, APP_FILTER, APP_GUARD } from '@nestjs/core';
import { MulterModule } from '@nestjs/platform-express';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { HttpExceptionFilter } from '@schematics/filters/http-exception.filter';
import { HideObjectPropertyInterceptor } from '@schematics/interceptors/hide-object-prop.interceptor';
import { JsonMaskInterceptor } from '@schematics/interceptors/json-mask.interceptor';
import { LoggingInterceptor } from '@schematics/interceptors/logging.interceptor';
import { TimeoutInterceptor } from '@schematics/interceptors/timeout.interceptor';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './modules/user/user.module';
import { UserInterestModule } from './modules/user-interest/user-interest.module';
import { InterestModule } from './modules/interest/interest.module';
import { UserSettingModule } from './modules/user-setting/user-setting.module';
import { UserProfileModule } from './modules/user-profile/user-profile.module';
import { InstitutionModule } from './modules/institution/institution.module';
import { DepartmentModule } from './modules/department/department.module';
import { NotificationModule } from './modules/notification/notification.module';
import { ArticleModule } from './modules/article/article.module';
import { ArticleTagModule } from './modules/article-tag/article-tag.module';
import { ArticleCommentModule } from './modules/article-comment/article-comment.module';
import { ArticleCommentLikeModule } from './modules/article-comment-like/article-comment-like.module';
import { ArticleCommentReplyModule } from './modules/article-comment-reply/article-comment-reply.module';
import { ArticleReactionModule } from './modules/article-reaction/article-reaction.module';
import { PostModule } from './modules/post/post.module';
import { PostCommentModule } from './modules/post-comment/post-comment.module';
import { PostLikeModule } from './modules/post-like/post-like.module';
import { PostCommentReplyModule } from './modules/post-comment-reply/post-comment-reply.module';
import { ForumModule } from './modules/forum/forum.module';
import { ForumAnswerModule } from './modules/forum-answer/forum-answer.module';
import { ForumReactionModule } from './modules/forum-reaction/forum-reaction.module';
import { ForumAnswerReactionModule } from './modules/forum-answer-reaction/forum-answer-reaction.module';
import { UserConnectionModule } from './modules/user-connection/user-connection.module';
import { UserFollowerModule } from './modules/user-follower/user-follower.module';
import { UserFollowerBlacklistModule } from './modules/user-follower-blacklist/user-follower-blacklist.module';
import { UserConnectionBlacklistModule } from './modules/user-connection-blacklist/user-connection-blacklist.module';
import { ChatMessageModule } from './modules/chat-message/chat-message.module';
import { ChatMessageReplyModule } from './modules/chat-message-reply/chat-message-reply.module';
import { ChatRoomModule } from './modules/chat-room/chat-room.module';
import { GroupModule } from './modules/group/group.module';
import { GroupMemberModule } from './modules/group-member/group-member.module';
import { GroupJoinRequestModule } from './modules/group-join-request/group-join-request.module';
import { GroupChatMessageModule } from './modules/group-chat-message/group-chat-message.module';
import { GroupChatMessageReplyModule } from './modules/group-chat-message-reply/group-chat-message-reply.module';
import ormConfig from './orm.config';

export function DatabaseOrmModule(): DynamicModule {
  // we could load the configuration from dotEnv here,
  // but typeORM cli would not be able to find the configuration file.
  return TypeOrmModule.forRoot(ormConfig);
}

@Module({
  imports: [
    DatabaseOrmModule(),
    MulterModule.register({
      dest: './uploads',
    }),
    ThrottlerModule.forRoot({
      ttl: 60,
      limit: 15,
    }),
    EventEmitterModule.forRoot(),
    AuthModule,
    UserModule,
    UserInterestModule,
    InterestModule,
    UserSettingModule,
    UserProfileModule,
    InstitutionModule,
    DepartmentModule,
    NotificationModule,
    ArticleModule,
    ArticleTagModule,
    ArticleCommentModule,
    ArticleCommentLikeModule,
    ArticleCommentReplyModule,
    ArticleReactionModule,
    PostModule,
    PostCommentModule,
    PostLikeModule,
    PostCommentReplyModule,
    ForumModule,
    ForumAnswerModule,
    ForumReactionModule,
    ForumAnswerReactionModule,
    UserConnectionModule,
    UserFollowerModule,
    UserFollowerBlacklistModule,
    UserConnectionBlacklistModule,
    ChatMessageModule,
    ChatMessageReplyModule,
    ChatRoomModule,
    GroupModule,
    GroupMemberModule,
    GroupJoinRequestModule,
    GroupChatMessageModule,
    GroupChatMessageReplyModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: JsonMaskInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: HideObjectPropertyInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: TimeoutInterceptor,
    },
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    AppService,
  ],
})
export class AppModule {}
