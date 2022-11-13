import { Test, TestingModule } from '@nestjs/testing';
import { ArticleCommentReplyController } from './article-comment-reply.controller';

describe('ArticleCommentReplyController', () => {
  let controller: ArticleCommentReplyController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ArticleCommentReplyController],
    }).compile();

    controller = module.get<ArticleCommentReplyController>(ArticleCommentReplyController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
