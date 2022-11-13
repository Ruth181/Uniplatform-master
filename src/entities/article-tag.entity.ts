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
import { v4 as uuidV4 } from 'uuid';
import { Article } from './article.entity';
import { Interest } from './interest.entity';

@Entity('ARTICLE_TAG')
export class ArticleTag extends BaseEntity {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  articleId: string;

  @ApiProperty({ type: () => Article })
  @ManyToOne(() => Article, ({ tagsForThisArticle }) => tagsForThisArticle)
  @JoinColumn({ name: 'articleId' })
  article: Article;

  @Column({ type: 'uuid' })
  interestId: string;

  @ApiProperty({ type: () => Interest })
  @JoinColumn({ name: 'interestId' })
  @ManyToOne(
    () => Interest,
    ({ articlesTaggedWithThisInterest }) => articlesTaggedWithThisInterest,
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
