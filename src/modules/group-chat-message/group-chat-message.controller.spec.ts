import { Test, TestingModule } from '@nestjs/testing';
import { GroupChatMessageController } from './group-chat-message.controller';

describe('GroupChatController', () => {
  let controller: GroupChatMessageController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GroupChatMessageController],
    }).compile();

    controller = module.get<GroupChatMessageController>(
      GroupChatMessageController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
