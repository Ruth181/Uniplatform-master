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
import { Interest } from './interest.entity';
import { User } from './user.entity';

@Entity('USER_INTEREST')
export class UserInterest extends BaseEntity {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  userId: string;

  @ApiProperty({
    type: () => User,
  })
  @JoinColumn({ name: 'userId' })
  @ManyToOne(() => User, ({ userInterests }) => userInterests)
  user: User;

  @Column({ type: 'uuid' })
  interestId: string;

  @ApiProperty({
    type: () => Interest,
  })
  @JoinColumn({ name: 'interestId' })
  @ManyToOne(
    () => Interest,
    ({ usersWithThisInterest }) => usersWithThisInterest,
    {
      onDelete: 'CASCADE',
    },
  )
  interest: Interest;

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
