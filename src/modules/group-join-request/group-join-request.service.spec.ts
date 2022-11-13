import { Test, TestingModule } from '@nestjs/testing';
import { GroupJoinRequestService } from './group-join-request.service';

describe('GroupJoinRequestService', () => {
  let service: GroupJoinRequestService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GroupJoinRequestService],
    }).compile();

    service = module.get<GroupJoinRequestService>(GroupJoinRequestService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
