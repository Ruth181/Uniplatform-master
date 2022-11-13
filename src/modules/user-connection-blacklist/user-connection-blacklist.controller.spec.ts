import { Test, TestingModule } from '@nestjs/testing';
import { UserConnectionBlacklistController } from './user-connection-blacklist.controller';

describe('UserConnectionBlacklistController', () => {
  let controller: UserConnectionBlacklistController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserConnectionBlacklistController],
    }).compile();

    controller = module.get<UserConnectionBlacklistController>(UserConnectionBlacklistController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
