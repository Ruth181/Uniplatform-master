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
import { PostComment } from './post-comment.entity';
import { PostLike } from './post-like.entity';
import { User } from './user.entity';

@Entity('POST')
export class Post extends BaseEntity {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  userId: string;

  @ApiProperty({ type: () => User })
  @JoinColumn({ name: 'userId' })
  @ManyToOne(() => User, ({ postsMadeByThisUser }) => postsMadeByThisUser, {
    onDelete: 'CASCADE',
  })
  user: User;

  @ApiProperty()
  @Column({ type: 'text' })
  text: string;

  @ApiProperty()
  @Column({ type: 'text', nullable: true })
  imageUrl: string;

  @ApiProperty()
  @Column({ type: 'varchar', length: 255, nullable: true })
  location: string;

  @ApiProperty()
  @Column({ type: 'boolean', default: true })
  status: boolean;

  @ApiProperty()
  @CreateDateColumn()
  dateCreated: Date;

  @ApiProperty()
  @UpdateDateColumn()
  dateUpdated: Date;

  @ApiProperty({ type: () => [PostLike] })
  @OneToMany(() => PostLike, ({ post }) => post, { cascade: true })
  likesForThisPost: PostLike[];

  @ApiProperty({ type: () => [PostComment] })
  @OneToMany(() => PostComment, ({ post }) => post, { cascade: true })
  commentsForThisPost: PostComment[];

  @BeforeInsert()
  beforeInsertHandler(): void {
    this.id = uuidV4();
  }
}
