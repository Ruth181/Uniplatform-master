import { Test, TestingModule } from '@nestjs/testing';
import { ArticleCommentLikeController } from './article-comment-like.controller';

describe('ArticleCommentLikeController', () => {
  let controller: ArticleCommentLikeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ArticleCommentLikeController],
    }).compile();

    controller = module.get<ArticleCommentLikeController>(ArticleCommentLikeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
