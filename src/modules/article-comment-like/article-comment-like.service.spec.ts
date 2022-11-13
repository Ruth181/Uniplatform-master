import { Test, TestingModule } from '@nestjs/testing';
import { ArticleCommentLikeService } from './article-comment-like.service';

describe('ArticleCommentLikeService', () => {
  let service: ArticleCommentLikeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ArticleCommentLikeService],
    }).compile();

    service = module.get<ArticleCommentLikeService>(ArticleCommentLikeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
