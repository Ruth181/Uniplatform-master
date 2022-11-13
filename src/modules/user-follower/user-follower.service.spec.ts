import { Test, TestingModule } from '@nestjs/testing';
import { UserFollowerService } from './user-follower.service';

describe('UserFollowerService', () => {
  let service: UserFollowerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserFollowerService],
    }).compile();

    service = module.get<UserFollowerService>(UserFollowerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
