import { Test, TestingModule } from '@nestjs/testing';
import { GroupChatMessageReplyController } from './group-chat-message-reply.controller';

describe('GroupChatMessageReplyController', () => {
  let controller: GroupChatMessageReplyController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GroupChatMessageReplyController],
    }).compile();

    controller = module.get<GroupChatMessageReplyController>(GroupChatMessageReplyController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
