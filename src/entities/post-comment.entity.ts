import { ApiProperty } from '@nestjs/swagger';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  UpdateDateColumn,
  BeforeInsert,
  PrimaryGeneratedColumn,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { v4 as uuidV4 } from 'uuid';
import { PostCommentReply } from './post-comment-reply.entity';
import { Post } from './post.entity';
import { User } from './user.entity';

@Entity('POST_COMMENT')
export class PostComment extends BaseEntity {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', nullable: true })
  userId: string;

  @ApiProperty({ type: () => User })
  @JoinColumn({ name: 'userId' })
  @ManyToOne(
    () => User,
    ({ commentsToPostsMadeByThisUser }) => commentsToPostsMadeByThisUser,
    {
      onDelete: 'CASCADE',
    },
  )
  user: User;

  @Column({ type: 'uuid', nullable: true })
  postId: string;

  @ApiProperty({ type: () => Post })
  @JoinColumn({ name: 'postId' })
  @ManyToOne(() => Post, ({ commentsForThisPost }) => commentsForThisPost, {
    onDelete: 'CASCADE',
  })
  post: Post;

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

  @ApiProperty({ type: () => [PostCommentReply] })
  @OneToMany(() => PostCommentReply, ({ postComment }) => postComment, {
    cascade: true,
  })
  repliesToThisComment: PostCommentReply[];

  @BeforeInsert()
  beforeInsertHandler(): void {
    this.id = uuidV4();
  }
}
