import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  BeforeInsert,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { v4 as uuidV4 } from 'uuid';
import { UserProfile } from './user-profile.entity';

@Entity('DEPARTMENT')
export class Department extends BaseEntity {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty()
  @Column({ type: 'varchar', length: 100 })
  name: string;

  @ApiProperty()
  @Column({ type: 'boolean', default: true })
  status: boolean;

  @ApiProperty()
  @CreateDateColumn()
  dateCreated: Date;

  @ApiProperty()
  @UpdateDateColumn()
  dateUpdated: Date;

  @ApiProperty({ type: () => [UserProfile] })
  @OneToMany(() => UserProfile, ({ department }) => department)
  usersForThisDepartment: UserProfile[];

  @BeforeInsert()
  beforeInsertHandler(): void {
    this.id = uuidV4();
  }
}
