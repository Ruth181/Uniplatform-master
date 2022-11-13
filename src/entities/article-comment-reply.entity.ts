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
} from 'typeorm';
import { v4 as uuidV4 } from 'uuid';
import { ArticleComment } from './article-comment.entity';
import { User } from './user.entity';

@Entity('ARTICLE_COMMENT_REPLY')
export class ArticleCommentReply extends BaseEntity {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  articleCommentId: string;

  @ApiProperty({ type: () => ArticleComment })
  @JoinColumn({ name: 'articleCommentId' })
  @ManyToOne(
    () => ArticleComment,
    ({ repliesMadeForThisComment }) => repliesMadeForThisComment,
    {
      onDelete: 'CASCADE',
    },
  )
  articleComment: ArticleComment;

  @ApiProperty()
  @Column({ type: 'text' })
  text: string;

  @Column({ type: 'uuid' })
  userId: string;

  @ApiProperty({ type: () => User })
  @JoinColumn({ name: 'userId' })
  @ManyToOne(
    () => User,
    ({ repliesToCommentsMadeByThisUser }) => repliesToCommentsMadeByThisUser,
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
