import { Test, TestingModule } from '@nestjs/testing';
import { GroupChatMessageGateway } from './group-chat-message.gateway';

describe('GroupChatMessageGateway', () => {
  let gateway: GroupChatMessageGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GroupChatMessageGateway],
    }).compile();

    gateway = module.get<GroupChatMessageGateway>(GroupChatMessageGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
