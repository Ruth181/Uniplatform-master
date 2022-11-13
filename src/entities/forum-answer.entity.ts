import {
  BaseEntity,
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { v4 as uuidV4 } from 'uuid';
import { Forum } from './forum.entity';
import { User } from './user.entity';
import { ForumAnswerReaction } from './forum-answer-reaction.entity';

@Entity('FORUM_ANSWER')
export class ForumAnswer extends BaseEntity {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  userId: string;

  @ApiProperty({ type: () => User })
  @JoinColumn({ name: 'userId' })
  @ManyToOne(
    () => User,
    ({ forumAnswersMadeByThisUser }) => forumAnswersMadeByThisUser,
    { onDelete: 'CASCADE' },
  )
  user: User;

  @Column({ type: 'uuid' })
  forumId: string;

  @ApiProperty({ type: () => Forum })
  @JoinColumn({ name: 'forumId' })
  @ManyToOne(() => Forum, ({ answersForThisForum }) => answersForThisForum, {
    onDelete: 'CASCADE',
  })
  forum: Forum;

  @ApiProperty()
  @Column({ type: 'text' })
  text: string;

  @Column({ type: 'boolean', default: false })
  isBestAnswer: boolean;

  @ApiProperty()
  @Column({ type: 'boolean', default: true })
  status: boolean;

  @ApiProperty()
  @CreateDateColumn()
  dateCreated: Date;

  @ApiProperty()
  @UpdateDateColumn()
  dateUpdated: Date;

  @ApiProperty({ type: () => [ForumAnswerReaction] })
  @OneToMany(() => ForumAnswerReaction, ({ forumAnswer }) => forumAnswer, {
    cascade: true,
  })
  reactionsForThisForumAnswer: ForumAnswerReaction[];

  @BeforeInsert()
  beforeInsertHandler(): void {
    this.id = uuidV4();
  }
}
