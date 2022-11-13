import { ApiProperty } from '@nestjs/swagger';
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
import { v4 as uuidV4 } from 'uuid';
import { Group } from './group.entity';
import { User } from './user.entity';

@Entity('GROUP_JOIN_REQUEST')
export class GroupJoinRequest extends BaseEntity {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  groupId: string;

  @ApiProperty({ type: () => Group })
  @JoinColumn({ name: 'groupId' })
  @ManyToOne(
    () => Group,
    ({ requestsToJoinThisGroup }) => requestsToJoinThisGroup,
    {
      onDelete: 'CASCADE',
    },
  )
  group: Group;

  @Column({ type: 'uuid' })
  userId: string;

  @ApiProperty({ type: () => User })
  @JoinColumn({ name: 'userId' })
  @ManyToOne(
    () => User,
    ({ requestsToJoinGroupsByThisUser }) => requestsToJoinGroupsByThisUser,
    {
      onDelete: 'CASCADE',
    },
  )
  user: User;

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
