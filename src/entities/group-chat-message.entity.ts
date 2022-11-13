import { ApiProperty } from '@nestjs/swagger';
import { MessageType } from '@utils/types/utils.constant';
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
import { v4 as uuidV4 } from 'uuid';
import { GroupChatMessageReply } from './group-chat-message-reply.entity';
import { Group } from './group.entity';
import { User } from './user.entity';

@Entity('GROUP_CHAT_MESSAGE')
export class GroupChatMessage extends BaseEntity {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  groupId: string;

  @ApiProperty({ type: () => Group })
  @JoinColumn({ name: 'groupId' })
  @ManyToOne(
    () => Group,
    ({ messagesSentToThisGroup }) => messagesSentToThisGroup,
    {
      onDelete: 'CASCADE',
    },
  )
  group: Group;

  @ApiProperty({ enum: MessageType })
  @Column({ enum: MessageType, default: MessageType.TEXT })
  type: MessageType;

  @ApiProperty()
  @Column({ type: 'boolean', default: false })
  isRead: boolean;

  @ApiProperty()
  @Column({ type: 'text' })
  content: string;

  @Column({ type: 'uuid' })
  senderId: string;

  @ApiProperty({ type: () => User })
  @JoinColumn({ name: 'senderId' })
  @ManyToOne(
    () => User,
    ({ messagesSentByThusUserToGroups }) => messagesSentByThusUserToGroups,
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

  @ApiProperty({ type: () => [GroupChatMessageReply] })
  @OneToMany(
    () => GroupChatMessageReply,
    ({ groupChatMessage }) => groupChatMessage,
    {
      cascade: true,
    },
  )
  repliesToThisMessage: GroupChatMessageReply[];

  @BeforeInsert()
  beforeInsertHandler(): void {
    this.id = uuidV4();
  }
}
