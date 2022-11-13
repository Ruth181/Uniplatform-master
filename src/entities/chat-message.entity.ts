import { MessageType } from '@utils/types/utils.constant';
import { ApiProperty } from '@nestjs/swagger';
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
  OneToMany,
} from 'typeorm';
import { v4 as uuidV4 } from 'uuid';
import { User } from './user.entity';
import { ChatMessageReply } from './chat-message-reply.entity';

@Entity('CHAT_MESSAGE')
export class ChatMessage extends BaseEntity {
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
  senderId: string;

  @ApiProperty({ type: () => User })
  @JoinColumn({ name: 'senderId' })
  @ManyToOne(() => User, ({ chatMessagesSentByYou }) => chatMessagesSentByYou, {
    onDelete: 'CASCADE',
  })
  sender: User;

  @Column({ type: 'uuid' })
  receiverId: string;

  @ApiProperty({ type: () => User })
  @JoinColumn({ name: 'receiverId' })
  @ManyToOne(() => User, ({ chatMessagesSentToYou }) => chatMessagesSentToYou, {
    onDelete: 'CASCADE',
  })
  receiver: User;

  @ApiProperty()
  @Column({ type: 'boolean', default: false })
  isRead: boolean;

  @ApiProperty()
  @Column({ type: 'boolean', default: true })
  status: boolean;

  @ApiProperty()
  @CreateDateColumn()
  dateCreated: Date;

  @ApiProperty()
  @UpdateDateColumn()
  dateUpdated: Date;

  @ApiProperty({ type: () => [ChatMessageReply] })
  @OneToMany(() => ChatMessageReply, ({ chatMessage }) => chatMessage, {
    cascade: true,
  })
  repliesMadeThisMessage: ChatMessageReply[];

  @BeforeInsert()
  beforeInsertHandler(): void {
    this.id = uuidV4();
  }
}
