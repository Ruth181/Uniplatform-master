import { Test, TestingModule } from '@nestjs/testing';
import { ForumAnswerReactionService } from './forum-answer-reaction.service';

describe('ForumAnswerReactionService', () => {
  let service: ForumAnswerReactionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ForumAnswerReactionService],
    }).compile();

    service = module.get<ForumAnswerReactionService>(ForumAnswerReactionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
