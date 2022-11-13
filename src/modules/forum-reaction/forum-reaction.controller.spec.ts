import { Test, TestingModule } from '@nestjs/testing';
import { ForumReactionController } from './forum-reaction.controller';

describe('ForumReactionController', () => {
  let controller: ForumReactionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ForumReactionController],
    }).compile();

    controller = module.get<ForumReactionController>(ForumReactionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
