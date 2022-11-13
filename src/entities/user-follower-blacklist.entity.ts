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
import { v4 as uuidV4 } from 'uuid';
import { User } from './user.entity';

@Entity('USER_FOLLOWER_BLACKLIST')
export class UserFollowerBlacklist extends BaseEntity {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  blacklistedUserId: string;

  @ApiProperty({ type: () => User })
  @JoinColumn({ name: 'blacklistedUserId' })
  @ManyToOne(
    () => User,
    ({ recordsOfFollowersWhoBlacklistedYou }) =>
      recordsOfFollowersWhoBlacklistedYou,
    {
      onDelete: 'CASCADE',
    },
  )
  blacklistedUser: User;

  @Column({ type: 'uuid' })
  userId: string;

  @ApiProperty({ type: () => User })
  @JoinColumn({ name: 'userId' })
  @ManyToOne(
    () => User,
    ({ recordsOfFollowersYouBlacklisted }) => recordsOfFollowersYouBlacklisted,
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
