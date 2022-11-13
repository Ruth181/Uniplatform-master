import { Test, TestingModule } from '@nestjs/testing';
import { ChatMessageReplyController } from './chat-message-reply.controller';

describe('ChatMessageReplyController', () => {
  let controller: ChatMessageReplyController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ChatMessageReplyController],
    }).compile();

    controller = module.get<ChatMessageReplyController>(ChatMessageReplyController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
