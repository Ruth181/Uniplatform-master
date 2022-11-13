import { Test, TestingModule } from '@nestjs/testing';
import { ArticleReactionService } from './article-reaction.service';

describe('ArticleReactionService', () => {
  let service: ArticleReactionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ArticleReactionService],
    }).compile();

    service = module.get<ArticleReactionService>(ArticleReactionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
