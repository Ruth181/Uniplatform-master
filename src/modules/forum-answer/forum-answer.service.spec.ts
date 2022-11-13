import { Test, TestingModule } from '@nestjs/testing';
import { ForumAnswerService } from './forum-answer.service';

describe('ForumAnswerService', () => {
  let service: ForumAnswerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ForumAnswerService],
    }).compile();

    service = module.get<ForumAnswerService>(ForumAnswerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
