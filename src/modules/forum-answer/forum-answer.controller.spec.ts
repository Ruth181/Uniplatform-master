import { Test, TestingModule } from '@nestjs/testing';
import { ForumAnswerController } from './forum-answer.controller';

describe('ForumAnswerController', () => {
  let controller: ForumAnswerController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ForumAnswerController],
    }).compile();

    controller = module.get<ForumAnswerController>(ForumAnswerController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
