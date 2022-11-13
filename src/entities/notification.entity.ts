import { ApiProperty } from '@nestjs/swagger';
import { NotificationType } from '@utils/types/utils.constant';
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
import { v4 as uuidV4 } from 'uuid';
import { User } from './user.entity';

@Entity('NOTIFICATION')
export class Notification extends BaseEntity {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  userId: string;

  @ApiProperty({ type: () => User })
  @JoinColumn({ name: 'userId' })
  @ManyToOne(
    () => User,
    ({ notificationsForThisUser }) => notificationsForThisUser,
    {
      onDelete: 'CASCADE',
    },
  )
  user: User;

  @ApiProperty()
  @Column({ type: 'text' })
  message: string;

  @ApiProperty({ enum: NotificationType })
  @Column({ enum: NotificationType })
  notificationType: NotificationType;

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
    this.message = this.message.toUpperCase();
  }
}
