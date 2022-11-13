import { ApiProperty } from '@nestjs/swagger';
import {
  AppRole,
  AuthProvider,
  DefaultPassportLink,
} from '@utils/types/utils.constant';
import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  BeforeInsert,
  AfterInsert,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { v4 as uuidV4 } from 'uuid';
import { hashPassword, sendEmail } from '@utils/functions/utils.function';
import { UserInterest } from './user-interest.entity';
import { Article } from './article.entity';
import { ArticleComment } from './article-comment.entity';
import { ArticleCommentLike } from './article-comment-like.entity';
import { ArticleCommentReply } from './article-comment-reply.entity';
import { Notification } from './notification.entity';
import { ArticleReaction } from './article-reaction.entity';
import { Post } from './post.entity';
import { PostLike } from './post-like.entity';
import { PostComment } from './post-comment.entity';
import { PostCommentReply } from './post-comment-reply.entity';
import { ForumReaction } from './forum-reaction.entity';
import { Forum } from './forum.entity';
import { ForumAnswer } from './forum-answer.entity';
import { ForumAnswerReaction } from './forum-answer-reaction.entity';
import { UserConnection } from './user-connection.entity';
import { UserFollower } from './user-follower.entity';
import { UserProfile } from './user-profile.entity';
import { UserSetting } from './user-setting.entity';
import { UserConnectionBlacklist } from './user-connection-blacklist.entity';
import { UserFollowerBlacklist } from './user-follower-blacklist.entity';
import { ChatMessage } from './chat-message.entity';
import { ChatMessageReply } from './chat-message-reply.entity';
import { Group } from './group.entity';
import { GroupMember } from './group-member.entity';
import { GroupJoinRequest } from './group-join-request.entity';
import { GroupChatMessage } from './group-chat-message.entity';
import { GroupChatMessageReply } from './group-chat-message-reply.entity';

@Entity('USER')
export class User extends BaseEntity {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty()
  @Column({ type: 'varchar', length: 50, nullable: true })
  phoneNumber: string;

  @ApiProperty()
  @Column({ type: 'varchar', length: 255 })
  email: string;

  @ApiProperty()
  @Column({ type: 'varchar', length: 255 })
  password: string;

  @ApiProperty({ enum: AppRole })
  @Column({ enum: AppRole, default: AppRole.STUDENT })
  role: AppRole;

  @ApiProperty()
  @Column({ type: 'text', default: DefaultPassportLink.male })
  profileImageUrl: string;

  @ApiProperty({ enum: AuthProvider })
  @Column({ enum: AuthProvider, default: AuthProvider.LOCAL })
  provider: AuthProvider;

  @ApiProperty()
  @Column({ type: 'varchar', length: 100, default: 'NIGERIA' })
  country: string;

  @ApiProperty({
    nullable: true,
    description: `userId from facebook/google gotten during external logins`,
  })
  @Column({ type: 'varchar', length: 255, nullable: true })
  externalUserId: string;

  @ApiProperty({ nullable: true })
  @Column({ type: 'varchar', length: 100, nullable: true })
  uniqueVerificationCode: string;

  @ApiProperty()
  @Column({ type: 'boolean', default: false })
  status: boolean;

  @ApiProperty()
  @CreateDateColumn()
  dateCreated: Date;

  @ApiProperty()
  @UpdateDateColumn()
  dateUpdated: Date;

  @ApiProperty({ type: () => [UserConnectionBlacklist] })
  @OneToMany(
    () => UserConnectionBlacklist,
    ({ blacklistedUser }) => blacklistedUser,
    { cascade: true },
  )
  recordsOfConnectionsYouBlacklisted: UserConnectionBlacklist[];

  @ApiProperty({ type: () => [UserConnectionBlacklist] })
  @OneToMany(
    () => UserConnectionBlacklist,
    ({ blacklistedUser }) => blacklistedUser,
    { cascade: true },
  )
  recordsOfConnectionsWhoBlacklistedYou: UserConnectionBlacklist[];

  @ApiProperty({ type: () => [UserConnectionBlacklist] })
  @OneToMany(
    () => UserFollowerBlacklist,
    ({ blacklistedUser }) => blacklistedUser,
    { cascade: true },
  )
  recordsOfFollowersWhoBlacklistedYou: UserFollowerBlacklist[];

  @ApiProperty({ type: () => [UserFollowerBlacklist] })
  @OneToMany(
    () => UserFollowerBlacklist,
    ({ blacklistedUser }) => blacklistedUser,
    { cascade: true },
  )
  recordsOfFollowersYouBlacklisted: UserFollowerBlacklist[];

  @ApiProperty({ type: () => [UserProfile] })
  @OneToMany(() => UserProfile, ({ user }) => user, { cascade: true })
  userProfiles: UserProfile[];

  @ApiProperty({ type: () => [UserSetting] })
  @OneToMany(() => UserSetting, ({ user }) => user, { cascade: true })
  userSettings: UserSetting[];

  @ApiProperty({ type: () => [UserInterest] })
  @OneToMany(() => UserInterest, ({ user }) => user, { cascade: true })
  userInterests: UserInterest[];

  @ApiProperty({ type: () => [Article] })
  @OneToMany(() => Article, ({ user }) => user, { cascade: true })
  articlesWrittenByThisUser: Article[];

  @ApiProperty({ type: () => [ArticleReaction] })
  @OneToMany(() => ArticleReaction, ({ user }) => user, { cascade: true })
  reactionsToArticlesMadeByThisUser: ArticleReaction[];

  @ApiProperty({ type: () => [ArticleComment] })
  @OneToMany(() => ArticleComment, ({ user }) => user, { cascade: true })
  commentsMadeByThisUser: ArticleComment[];

  @ApiProperty({ type: () => [ArticleCommentLike] })
  @OneToMany(() => ArticleCommentLike, ({ user }) => user, { cascade: true })
  likesOnCommentsMadeByThisUser: ArticleCommentLike[];

  @ApiProperty({ type: () => [ArticleCommentReply] })
  @OneToMany(() => ArticleCommentReply, ({ user }) => user, { cascade: true })
  repliesToCommentsMadeByThisUser: ArticleCommentReply[];

  @ApiProperty({ type: () => [Notification] })
  @OneToMany(() => Notification, ({ user }) => user, { cascade: true })
  notificationsForThisUser: Notification[];

  @ApiProperty({ type: () => [Post] })
  @OneToMany(() => Post, ({ user }) => user, { cascade: true })
  postsMadeByThisUser: Post[];

  @ApiProperty({ type: () => [PostComment] })
  @OneToMany(() => Post, ({ user }) => user, { cascade: true })
  commentsToPostsMadeByThisUser: PostComment[];

  @ApiProperty({ type: () => [PostCommentReply] })
  @OneToMany(() => PostCommentReply, ({ user }) => user, { cascade: true })
  commentRepliesToPostsMadeByThisUser: PostCommentReply[];

  @ApiProperty({ type: () => [PostLike] })
  @OneToMany(() => PostLike, ({ user }) => user, { cascade: true })
  postLikesForThisUser: PostLike[];

  @ApiProperty({ type: () => [Forum] })
  @OneToMany(() => Forum, ({ user }) => user, { cascade: true })
  forumQuestionsByThisUser: Forum[];

  @ApiProperty({ type: () => [ForumReaction] })
  @OneToMany(() => ForumReaction, ({ user }) => user, { cascade: true })
  forumReactionsByThisUser: ForumReaction[];

  @ApiProperty({ type: () => [ForumAnswerReaction] })
  @OneToMany(() => ForumAnswerReaction, ({ user }) => user, { cascade: true })
  forumAnswerReactionsByThisUser: ForumAnswerReaction[];

  @ApiProperty({ type: () => [ForumAnswer] })
  @OneToMany(() => ForumAnswer, ({ user }) => user, { cascade: true })
  forumAnswersMadeByThisUser: ForumAnswer[];

  @ApiProperty({ type: () => [UserConnection] })
  @OneToMany(() => UserConnection, ({ user }) => user, { cascade: true })
  userConnectionRecords: UserConnection[];

  @ApiProperty({ type: () => [UserConnection] })
  @OneToMany(() => UserConnection, ({ connectedToUser }) => connectedToUser, {
    cascade: true,
  })
  connectedToUserRecords: UserConnection[];

  @ApiProperty({ type: () => [UserFollower] })
  @OneToMany(() => UserFollower, ({ user }) => user, { cascade: true })
  userFollowerRecords: UserFollower[];

  @ApiProperty({ type: () => [UserFollower] })
  @OneToMany(() => UserFollower, ({ followUser }) => followUser, {
    cascade: true,
  })
  followingUserRecords: UserFollower[];

  @ApiProperty({ type: () => [ChatMessage] })
  @OneToMany(() => ChatMessage, ({ sender }) => sender, { cascade: true })
  chatMessagesSentByYou: ChatMessage[];

  @ApiProperty({ type: () => [ChatMessage] })
  @OneToMany(() => ChatMessage, ({ receiver }) => receiver, { cascade: true })
  chatMessagesSentToYou: ChatMessage[];

  @ApiProperty({ type: () => [ChatMessageReply] })
  @OneToMany(() => ChatMessageReply, ({ sender }) => sender, { cascade: true })
  chatMessageRepliesMadeByYou: ChatMessageReply[];

  @ApiProperty({ type: () => [Group] })
  @OneToMany(() => Group, ({ createdBy }) => createdBy, { cascade: true })
  groupsCreatedByYou: Group[];

  @ApiProperty({ type: () => [GroupMember] })
  @OneToMany(() => GroupMember, ({ user }) => user, { cascade: true })
  groupsYouAreIn: GroupMember[];

  @ApiProperty({ type: () => [GroupJoinRequest] })
  @OneToMany(() => GroupJoinRequest, ({ user }) => user, { cascade: true })
  requestsToJoinGroupsByThisUser: GroupJoinRequest[];

  @ApiProperty({ type: () => [GroupChatMessage] })
  @OneToMany(() => GroupChatMessage, ({ user }) => user, { cascade: true })
  messagesSentByThusUserToGroups: GroupChatMessage[];

  @ApiProperty({ type: () => [GroupChatMessageReply] })
  @OneToMany(() => GroupChatMessageReply, ({ user }) => user, { cascade: true })
  repliesToGroupMessagesSentByThisUser: GroupChatMessageReply[];

  @BeforeInsert()
  async beforeInsertHandler(): Promise<void> {
    this.id = uuidV4();
    this.email = this.email?.toLowerCase();
    if (this.country) {
      this.country = this.country.toUpperCase();
    }
    const setPassword = this.password ?? '12345';
    this.password = await hashPassword(setPassword);
  }

  @AfterInsert()
  afterInsertHandler(): void {
    setTimeout(async () => {
      if (this.role !== AppRole.ADMIN) {
        const htmlEmailTemplate = `
          <h2>Please copy the code below to verify your account</h2>
          <h3>${this.uniqueVerificationCode}</h3>
        `;
        await sendEmail(htmlEmailTemplate, 'Verify Account', [this.email]);
      }
    }, 5000);
  }
}
