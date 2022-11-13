import { Test, TestingModule } from '@nestjs/testing';
import { ChatMessageReplyService } from './chat-message-reply.service';

describe('ChatMessageReplyService', () => {
  let service: ChatMessageReplyService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ChatMessageReplyService],
    }).compile();

    service = module.get<ChatMessageReplyService>(ChatMessageReplyService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
