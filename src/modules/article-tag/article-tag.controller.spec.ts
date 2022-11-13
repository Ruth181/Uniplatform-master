import { Test, TestingModule } from '@nestjs/testing';
import { ArticleTagController } from './article-tag.controller';

describe('ArticleTagController', () => {
  let controller: ArticleTagController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ArticleTagController],
    }).compile();

    controller = module.get<ArticleTagController>(ArticleTagController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
