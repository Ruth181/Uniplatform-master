import { ApiProperty } from '@nestjs/swagger';
import {
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Column,
  JoinColumn,
  Entity,
  BeforeInsert,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { User } from './user.entity';
import { v4 as uuidV4 } from 'uuid';
import { GroupMember } from './group-member.entity';
import { GroupJoinRequest } from './group-join-request.entity';
import { GroupChatMessage } from './group-chat-message.entity';

@Entity('GROUP')
export class Group {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty()
  @Column({ type: 'text' })
  groupBio: string;

  @ApiProperty()
  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'boolean', default: false })
  isPrivate: boolean;

  @ApiProperty()
  @Column({ type: 'text' })
  groupPhoto: string;

  @Column({ type: 'uuid' })
  userId: string;

  @ApiProperty({ type: () => User })
  @JoinColumn({ name: 'userId' })
  @ManyToOne(() => User, ({ groupsCreatedByYou }) => groupsCreatedByYou, {
    onDelete: 'CASCADE',
  })
  createdBy: User;

  @ApiProperty()
  @Column({ type: 'boolean', default: true })
  status: boolean;

  @ApiProperty()
  @CreateDateColumn()
  dateCreated: Date;

  @ApiProperty()
  @UpdateDateColumn()
  dateUpdated: Date;

  @ApiProperty({ type: () => [GroupMember] })
  @OneToMany(() => GroupMember, ({ group }) => group, { cascade: true })
  membersForThisGroup: GroupMember[];

  @ApiProperty({ type: () => [GroupJoinRequest] })
  @OneToMany(() => GroupJoinRequest, ({ group }) => group, { cascade: true })
  requestsToJoinThisGroup: GroupJoinRequest[];

  @ApiProperty({ type: () => [GroupChatMessage] })
  @OneToMany(() => GroupChatMessage, ({ group }) => group, { cascade: true })
  messagesSentToThisGroup: GroupChatMessage[];

  @BeforeInsert()
  beforeInsertHandler(): void {
    this.id = uuidV4();
    this.name = this.name.toUpperCase();
  }
}
