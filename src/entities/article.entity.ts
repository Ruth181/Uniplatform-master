import { ApiProperty } from '@nestjs/swagger';
import { ArticleType } from '@utils/types/utils.constant';
import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  BeforeInsert,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { v4 as uuidV4 } from 'uuid';
import { ArticleComment } from './article-comment.entity';
import { ArticleReaction } from './article-reaction.entity';
import { ArticleTag } from './article-tag.entity';
import { User } from './user.entity';

@Entity('ARTICLE')
export class Article extends BaseEntity {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty()
  @Column({ type: 'varchar', length: 255 })
  title: string;

  @ApiProperty()
  @Column({ type: 'text' })
  body: string;

  @Column({ type: 'uuid' })
  userId: string;

  @ApiProperty({ type: () => User })
  @JoinColumn({ name: 'userId' })
  @ManyToOne(
    () => User,
    ({ articlesWrittenByThisUser }) => articlesWrittenByThisUser,
    {
      onDelete: 'CASCADE',
    },
  )
  user: User;

  @ApiProperty({ nullable: true })
  @Column({ type: 'text', nullable: true })
  coverPhoto: string;

  @ApiProperty({ enum: ArticleType })
  @Column({ enum: ArticleType, default: ArticleType.DRAFT })
  type: ArticleType;

  @ApiProperty()
  @Column({ type: 'boolean', default: true })
  status: boolean;

  @ApiProperty()
  @CreateDateColumn()
  dateCreated: Date;

  @ApiProperty()
  @UpdateDateColumn()
  dateUpdated: Date;

  @ApiProperty({ type: () => [ArticleTag] })
  @OneToMany(() => ArticleTag, ({ article }) => article)
  tagsForThisArticle: ArticleTag[];

  @ApiProperty({ type: () => [ArticleReaction] })
  @OneToMany(() => ArticleReaction, ({ article }) => article, { cascade: true })
  reactionsForThisArticle: ArticleReaction[];

  @ApiProperty({ type: () => [ArticleComment] })
  @OneToMany(() => ArticleComment, ({ article }) => article, { cascade: true })
  commentsForThisArticle: ArticleComment[];

  @BeforeInsert()
  beforeInsertHandler(): void {
    this.id = uuidV4();
    this.title = this.title.toUpperCase();
  }
}
