import { Test, TestingModule } from '@nestjs/testing';
import { UserFollowerBlacklistService } from './user-follower-blacklist.service';

describe('UserFollowerBlacklistService', () => {
  let service: UserFollowerBlacklistService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserFollowerBlacklistService],
    }).compile();

    service = module.get<UserFollowerBlacklistService>(UserFollowerBlacklistService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
