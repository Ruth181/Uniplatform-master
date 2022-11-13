import { ApiProperty } from '@nestjs/swagger';
import {
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  JoinColumn,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  BeforeInsert,
} from 'typeorm';
import { PostComment } from './post-comment.entity';
import { User } from './user.entity';
import { v4 as uuidV4 } from 'uuid';

@Entity('POST_COMMENT_REPLY')
export class PostCommentReply extends BaseEntity {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  userId: string;

  @ApiProperty({ type: () => User })
  @JoinColumn({ name: 'userId' })
  @ManyToOne(
    () => User,
    ({ commentRepliesToPostsMadeByThisUser }) =>
      commentRepliesToPostsMadeByThisUser,
    {
      onDelete: 'CASCADE',
    },
  )
  user: User;

  @Column({ type: 'uuid' })
  postCommentId: string;

  @ApiProperty({ type: () => PostComment })
  @JoinColumn({ name: 'postCommentId' })
  @ManyToOne(
    () => PostComment,
    ({ repliesToThisComment }) => repliesToThisComment,
    {
      onDelete: 'CASCADE',
    },
  )
  postComment: PostComment;

  @ApiProperty()
  @Column({ type: 'text' })
  text: string;

  @ApiProperty()
  @Column({ type: 'boolean', default: true })
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
