import {
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  BeforeInsert,
} from 'typeorm';
import { v4 as uuidV4 } from 'uuid';
import { MessageType } from '@utils/types/utils.constant';
import { ApiProperty } from '@nestjs/swagger';
import { User } from './user.entity';
import { ChatMessage } from './chat-message.entity';

@Entity('CHAT_MESSAGE_REPLY')
export class ChatMessageReply extends BaseEntity {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ enum: MessageType })
  @Column({ enum: MessageType, default: MessageType.TEXT })
  type: MessageType;

  @Column({ type: 'uuid' })
  senderId: string;

  @ApiProperty({ type: () => User })
  @JoinColumn({ name: 'senderId' })
  @ManyToOne(
    () => User,
    ({ chatMessageRepliesMadeByYou }) => chatMessageRepliesMadeByYou,
    {
      onDelete: 'CASCADE',
    },
  )
  sender: User;

  @Column({ type: 'uuid' })
  chatMessageId: string;

  @ApiProperty({ type: () => ChatMessage })
  @JoinColumn({ name: 'chatMessageId' })
  @ManyToOne(
    () => ChatMessage,
    ({ repliesMadeThisMessage }) => repliesMadeThisMessage,
    {
      onDelete: 'CASCADE',
    },
  )
  chatMessage: ChatMessage;

  @ApiProperty()
  @Column({ type: 'text' })
  content: string;

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
