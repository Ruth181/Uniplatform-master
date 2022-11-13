import { ApiProperty } from '@nestjs/swagger';
import { v4 as uuidV4 } from 'uuid';
import {
  BaseEntity,
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entity';
import {
  EducationalCategory,
  EducationalLevel,
} from '@utils/types/utils.constant';
import { Department } from './department.entity';
import { Institution } from './institution.entity';

@Entity('USER_PROFILE')
export class UserProfile extends BaseEntity {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty()
  @Column({ type: 'varchar', length: 255, nullable: true })
  firstName: string;

  @ApiProperty()
  @Column({ type: 'varchar', length: 255, nullable: true })
  lastName: string;

  @ApiProperty()
  @Column({ type: 'text', nullable: true })
  bio: string;

  @ApiProperty()
  @Column({ type: 'date', nullable: true })
  dateOfBirth: Date;

  @Column({ type: 'uuid' })
  userId: string;

  @ApiProperty({ type: () => User })
  @JoinColumn({ name: 'userId' })
  @ManyToOne(() => User, ({ userProfiles }) => userProfiles, {
    onDelete: 'CASCADE',
  })
  user: User;

  @ApiProperty()
  @Column({ type: 'varchar', length: 100, nullable: true })
  idCardName: string;

  @ApiProperty()
  @Column({ type: 'varchar', length: 100, nullable: true })
  idCardNumber: string;

  @ApiProperty()
  @Column({ type: 'text', nullable: true })
  idCard: string;

  @ApiProperty()
  @Column({ type: 'date', nullable: true })
  dateIssued: Date;

  @ApiProperty({ enum: EducationalCategory })
  @Column({
    enum: EducationalCategory,
    default: EducationalCategory.UNDER_GRADUATE,
  })
  category: EducationalCategory;

  @ApiProperty({ enum: EducationalLevel })
  @Column({ enum: EducationalLevel, default: EducationalLevel.DIPLOMA })
  level: EducationalLevel;

  @Column({ type: 'uuid' })
  departmentId: string;

  @ApiProperty({ type: () => Department })
  @JoinColumn({ name: 'departmentId' })
  @ManyToOne(
    () => Department,
    ({ usersForThisDepartment }) => usersForThisDepartment,
  )
  department: Department;

  @Column({ type: 'uuid' })
  institutionId: string;

  @ApiProperty({ type: () => Institution })
  @JoinColumn({ name: 'institutionId' })
  @ManyToOne(
    () => Institution,
    ({ usersForThisInstitution }) => usersForThisInstitution,
  )
  institution: Institution;

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
