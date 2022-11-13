import { Test, TestingModule } from '@nestjs/testing';
import { GroupChatMessageReplyService } from './group-chat-message-reply.service';

describe('GroupChatMessageReplyService', () => {
  let service: GroupChatMessageReplyService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GroupChatMessageReplyService],
    }).compile();

    service = module.get<GroupChatMessageReplyService>(GroupChatMessageReplyService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
