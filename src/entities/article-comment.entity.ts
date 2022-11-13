import { ApiProperty } from '@nestjs/swagger';
import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  BeforeInsert,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { v4 as uuidV4 } from 'uuid';
import { ArticleCommentLike } from './article-comment-like.entity';
import { ArticleCommentReply } from './article-comment-reply.entity';
import { Article } from './article.entity';
import { User } from './user.entity';

@Entity('ARTICLE_COMMENT')
export class ArticleComment extends BaseEntity {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  articleId: string;

  @ApiProperty({ type: () => Article })
  @JoinColumn({ name: 'articleId' })
  @ManyToOne(
    () => Article,
    ({ commentsForThisArticle }) => commentsForThisArticle,
    {
      onDelete: 'CASCADE',
    },
  )
  article: Article;

  @ApiProperty()
  @Column({ type: 'text' })
  text: string;

  @Column({ type: 'uuid' })
  userId: string;

  @ApiProperty({ type: () => User })
  @JoinColumn({ name: 'userId' })
  @ManyToOne(
    () => User,
    ({ commentsMadeByThisUser }) => commentsMadeByThisUser,
    {
      onDelete: 'CASCADE',
    },
  )
  user: User;

  @ApiProperty()
  @Column({ type: 'boolean', default: true })
  status: boolean;

  @ApiProperty()
  @CreateDateColumn()
  dateCreated: Date;

  @ApiProperty()
  @UpdateDateColumn()
  dateUpdated: Date;

  @ApiProperty({ type: () => [ArticleCommentLike] })
  @OneToMany(() => ArticleCommentLike, ({ articleComment }) => articleComment, {
    cascade: true,
  })
  likesForThisArticleComment: ArticleCommentLike[];

  @ApiProperty({ type: () => [ArticleCommentReply] })
  @OneToMany(
    () => ArticleCommentReply,
    ({ articleComment }) => articleComment,
    { cascade: true },
  )
  repliesMadeForThisComment: ArticleCommentReply[];

  @BeforeInsert()
  beforeInsertHandler(): void {
    this.id = uuidV4();
  }
}
