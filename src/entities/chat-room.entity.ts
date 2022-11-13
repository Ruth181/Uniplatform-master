import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  BeforeInsert,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { v4 as uuidV4 } from 'uuid';

@Entity('CHAT_ROOM')
export class ChatRoom extends BaseEntity {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  roomId: string;

  @Column({ type: 'uuid' })
  userOne: string; // select * from chat_room where [{ userOne: loogedInUser, userTwo: peerUSer }, [{ userTwo: loogedInUser, userOne: peerUSer }]

  @Column({ type: 'uuid' })
  userTwo: string;

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
    this.roomId = uuidV4();
  }
}
