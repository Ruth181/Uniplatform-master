import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  BeforeInsert,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { v4 as uuidV4 } from 'uuid';
import { ForumAnswer } from './forum-answer.entity';
import { ForumReaction } from './forum-reaction.entity';
import { User } from './user.entity';

@Entity('FORUM')
export class Forum extends BaseEntity {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty()
  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'uuid' })
  userId: string;

  @ApiProperty({ type: () => User })
  @JoinColumn({ name: 'userId' })
  @ManyToOne(
    () => User,
    ({ forumQuestionsByThisUser }) => forumQuestionsByThisUser,
    {
      onDelete: 'CASCADE',
    },
  )
  user: User;

  @ApiProperty()
  @Column({ type: 'text' })
  question: string;

  @ApiProperty()
  @Column({ type: 'jsonb', default: [] })
  reference: string[];

  @ApiProperty()
  @Column({ type: 'boolean', default: true })
  status: boolean;

  @ApiProperty()
  @CreateDateColumn()
  dateCreated: Date;

  @ApiProperty()
  @UpdateDateColumn()
  dateUpdated: Date;

  @ApiProperty({ type: () => [ForumReaction] })
  @OneToMany(() => ForumReaction, ({ forum }) => forum, { cascade: true })
  reactionsForThisForum: ForumReaction[];

  @ApiProperty({ type: () => [ForumAnswer] })
  @OneToMany(() => ForumAnswer, ({ forum }) => forum, { cascade: true })
  answersForThisForum: ForumAnswer[];

  @BeforeInsert()
  beforeInsertHandler(): void {
    this.id = uuidV4();
    this.title = this.title.toUpperCase();
    this.question = this.question.toUpperCase();
  }
}
