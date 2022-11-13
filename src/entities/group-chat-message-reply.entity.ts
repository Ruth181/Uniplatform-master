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
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { v4 as uuidV4 } from 'uuid';
import { GroupChatMessage } from './group-chat-message.entity';
import { User } from './user.entity';

@Entity('GROUP_CHAT_MESSAGE_REPLY')
export class GroupChatMessageReply extends BaseEntity {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ enum: MessageType })
  @Column({ enum: MessageType, default: MessageType.TEXT })
  type: MessageType;

  @ApiProperty()
  @Column({ type: 'text' })
  content: string;

  @Column({ type: 'uuid' })
  groupChatMessageId: string;

  @ApiProperty({ type: () => GroupChatMessage })
  @JoinColumn({ name: 'groupChatMessageId' })
  @ManyToOne(
    () => GroupChatMessage,
    ({ repliesToThisMessage }) => repliesToThisMessage,
    { onDelete: 'CASCADE' },
  )
  groupChatMessage: GroupChatMessage;

  @Column({ type: 'uuid' })
  senderId: string;

  @ApiProperty({ type: () => User })
  @JoinColumn({ name: 'senderId' })
  @ManyToOne(
    () => User,
    ({ repliesToGroupMessagesSentByThisUser }) =>
      repliesToGroupMessagesSentByThisUser,
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
