import { ApiProperty } from '@nestjs/swagger';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  BeforeInsert,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { v4 as uuidV4 } from 'uuid';
import { ArticleComment } from './article-comment.entity';
import { User } from './user.entity';

@Entity('ARTICLE_COMMENT_LIKE')
export class ArticleCommentLike extends BaseEntity {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  articleCommentId: string;

  @ApiProperty({ type: () => ArticleComment })
  @JoinColumn({ name: 'articleCommentId' })
  @ManyToOne(
    () => ArticleComment,
    ({ likesForThisArticleComment }) => likesForThisArticleComment,
    {
      onDelete: 'CASCADE',
    },
  )
  articleComment: ArticleComment;

  @Column({ type: 'uuid' })
  userId: string;

  @ApiProperty({ type: () => User })
  @JoinColumn({ name: 'userId' })
  @ManyToOne(
    () => User,
    ({ likesOnCommentsMadeByThisUser }) => likesOnCommentsMadeByThisUser,
    {
      onDelete: 'CASCADE',
    },
  )
  user: User;

  @ApiProperty()
  @Column({ type: 'boolean', default: false })
  status: boolean;

  @ApiProperty()
  @CreateDateColumn()
  dateCreated: Date;

  @ApiProperty()
  @UpdateDateColumn()
  dateUpdated: Date;

  @BeforeInsert()
  beforeInsertHandler(): void {
    this.id = uuidV4();
  }
}
