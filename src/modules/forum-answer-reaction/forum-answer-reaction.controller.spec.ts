import { Test, TestingModule } from '@nestjs/testing';
import { ForumAnswerReactionController } from './forum-answer-reaction.controller';

describe('ForumAnswerReactionController', () => {
  let controller: ForumAnswerReactionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ForumAnswerReactionController],
    }).compile();

    controller = module.get<ForumAnswerReactionController>(ForumAnswerReactionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
