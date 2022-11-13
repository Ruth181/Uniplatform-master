import { ArticleReaction } from '@entities/article-reaction.entity';
import { Injectable } from '@nestjs/common';
import { GenericService } from '@schematics/services/generic.service';

@Injectable()
export class ArticleReactionService extends GenericService(ArticleReaction) {}
