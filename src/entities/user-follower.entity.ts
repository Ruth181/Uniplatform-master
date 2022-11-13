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
import { ApiProperty } from '@nestjs/swagger';
import { v4 as uuidV4 } from 'uuid';
import { User } from './user.entity';

@Entity('USER_FOLLOWER')
export class UserFollower extends BaseEntity {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  userId: string;

  @ApiProperty({ type: () => User })
  @JoinColumn({ name: 'userId' })
  @ManyToOne(() => User, ({ userFollowerRecords }) => userFollowerRecords, {
    onDelete: 'CASCADE',
  })
  user: User;

  @Column({ type: 'uuid' })
  followUserId: string;

  @ApiProperty({ type: () => User })
  @JoinColumn({ name: 'connectedToUserId' })
  @ManyToOne(() => User, ({ followingUserRecords }) => followingUserRecords, {
    onDelete: 'CASCADE',
  })
  followUser: User;

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
