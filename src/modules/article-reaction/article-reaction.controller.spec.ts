import { Test, TestingModule } from '@nestjs/testing';
import { ArticleReactionController } from './article-reaction.controller';

describe('ArticleReactionController', () => {
  let controller: ArticleReactionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ArticleReactionController],
    }).compile();

    controller = module.get<ArticleReactionController>(ArticleReactionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
