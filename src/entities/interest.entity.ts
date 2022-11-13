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
import { UserInterest } from './user-interest.entity';
import { ArticleTag } from './article-tag.entity';

@Entity('INTEREST')
export class Interest extends BaseEntity {
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

  @ApiProperty({ type: () => [UserInterest] })
  @OneToMany(() => UserInterest, ({ interest }) => interest, { cascade: true })
  usersWithThisInterest: UserInterest[];

  @ApiProperty({ type: () => [ArticleTag] })
  @OneToMany(() => ArticleTag, ({ interest }) => interest, { cascade: true })
  articlesTaggedWithThisInterest: ArticleTag[];

  @BeforeInsert()
  beforeInsertHandler(): void {
    this.id = uuidV4();
  }
}
