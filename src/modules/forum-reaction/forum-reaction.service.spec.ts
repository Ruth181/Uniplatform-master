import { Test, TestingModule } from '@nestjs/testing';
import { ForumReactionService } from './forum-reaction.service';

describe('ForumReactionService', () => {
  let service: ForumReactionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ForumReactionService],
    }).compile();

    service = module.get<ForumReactionService>(ForumReactionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
