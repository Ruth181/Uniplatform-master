import { ApiProperty } from '@nestjs/swagger';
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
import { ReactionType } from '@utils/types/utils.constant';
import { User } from './user.entity';
import { v4 as uuidV4 } from 'uuid';
import { Article } from './article.entity';

@Entity('ARTICLE_REACTION')
export class ArticleReaction extends BaseEntity {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  userId: string;

  @ApiProperty({ type: () => User })
  @JoinColumn({ name: 'userId' })
  @ManyToOne(
    () => User,
    ({ reactionsToArticlesMadeByThisUser }) =>
      reactionsToArticlesMadeByThisUser,
    {
      onDelete: 'CASCADE',
    },
  )
  user: User;

  @Column({ type: 'uuid' })
  articleId: string;

  @ApiProperty({ type: () => Article })
  @ManyToOne(
    () => Article,
    ({ reactionsForThisArticle }) => reactionsForThisArticle,
    {
      onDelete: 'CASCADE',
    },
  )
  @JoinColumn({ name: 'articleId' })
  article: Article;

  @ApiProperty({ enum: ReactionType })
  @Column({ enum: ReactionType })
  purpose: ReactionType;

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
