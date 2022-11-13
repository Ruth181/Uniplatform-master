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
import { ApiProperty } from '@nestjs/swagger';
import { Forum } from './forum.entity';
import { v4 as uuidV4 } from 'uuid';
import { ForumReactionType } from '@utils/types/utils.constant';
import { User } from './user.entity';

@Entity('FORUM_REACTION')
export class ForumReaction extends BaseEntity {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  userId: string;

  @ApiProperty({ type: () => User })
  @JoinColumn({ name: 'userId' })
  @ManyToOne(
    () => User,
    ({ forumReactionsByThisUser }) => forumReactionsByThisUser,
    { onDelete: 'CASCADE' },
  )
  user: User;

  @Column({ type: 'uuid' })
  forumId: string;

  @ApiProperty({ type: () => Forum })
  @JoinColumn({ name: 'forumId' })
  @ManyToOne(
    () => Forum,
    ({ reactionsForThisForum }) => reactionsForThisForum,
    { onDelete: 'CASCADE' },
  )
  forum: Forum;

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
