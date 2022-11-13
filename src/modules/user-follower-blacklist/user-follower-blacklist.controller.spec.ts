import { Test, TestingModule } from '@nestjs/testing';
import { UserFollowerBlacklistController } from './user-follower-blacklist.controller';

describe('UserFollowerBlacklistController', () => {
  let controller: UserFollowerBlacklistController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserFollowerBlacklistController],
    }).compile();

    controller = module.get<UserFollowerBlacklistController>(UserFollowerBlacklistController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
