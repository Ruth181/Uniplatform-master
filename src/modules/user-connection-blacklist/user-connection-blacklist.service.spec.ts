import { Test, TestingModule } from '@nestjs/testing';
import { UserConnectionBlacklistService } from './user-connection-blacklist.service';

describe('UserConnectionBlacklistService', () => {
  let service: UserConnectionBlacklistService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserConnectionBlacklistService],
    }).compile();

    service = module.get<UserConnectionBlacklistService>(UserConnectionBlacklistService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
