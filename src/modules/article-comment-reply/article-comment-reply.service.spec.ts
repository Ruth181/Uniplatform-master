import { Test, TestingModule } from '@nestjs/testing';
import { ArticleCommentReplyService } from './article-comment-reply.service';

describe('ArticleCommentReplyService', () => {
  let service: ArticleCommentReplyService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ArticleCommentReplyService],
    }).compile();

    service = module.get<ArticleCommentReplyService>(ArticleCommentReplyService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
