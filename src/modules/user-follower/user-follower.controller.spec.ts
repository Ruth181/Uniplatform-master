import { Test, TestingModule } from '@nestjs/testing';
import { UserFollowerController } from './user-follower.controller';

describe('UserFollowerController', () => {
  let controller: UserFollowerController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserFollowerController],
    }).compile();

    controller = module.get<UserFollowerController>(UserFollowerController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
