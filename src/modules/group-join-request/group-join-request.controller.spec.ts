import { Test, TestingModule } from '@nestjs/testing';
import { GroupJoinRequestController } from './group-join-request.controller';

describe('GroupJoinRequestController', () => {
  let controller: GroupJoinRequestController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GroupJoinRequestController],
    }).compile();

    controller = module.get<GroupJoinRequestController>(GroupJoinRequestController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
