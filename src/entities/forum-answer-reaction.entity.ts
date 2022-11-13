import { ApiProperty } from '@nestjs/swagger';
import { ForumReactionType } from '@utils/types/utils.constant';
import {
  BaseEntity,
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Forum } from './forum.entity';
import { User } from './user.entity';
import { v4 as uuidV4 } from 'uuid';
import { ForumAnswer } from './forum-answer.entity';

@Entity('FORUM_ANSWER_REACTION')
export class ForumAnswerReaction extends BaseEntity {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  userId: string;

  @ApiProperty({ type: () => User })
  @JoinColumn({ name: 'userId' })
  @ManyToOne(
    () => User,
    ({ forumAnswerReactionsByThisUser }) => forumAnswerReactionsByThisUser,
    { onDelete: 'CASCADE' },
  )
  user: User;

  @Column({ type: 'uuid' })
  forumAnswerId: string;

  @ApiProperty({ type: () => Forum })
  @JoinColumn({ name: 'forumAnswerId' })
  @ManyToOne(
    () => ForumAnswer,
    ({ reactionsForThisForumAnswer }) => reactionsForThisForumAnswer,
    { onDelete: 'CASCADE' },
  )
  forumAnswer: ForumAnswer;

  @ApiProperty({ enum: ForumReactionType })
  @Column({ enum: ForumReactionType })
  type: ForumReactionType;

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
