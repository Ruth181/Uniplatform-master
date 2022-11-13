import { Test, TestingModule } from '@nestjs/testing';
import { UserConnectionController } from './user-connection.controller';

describe('UserConnectionController', () => {
  let controller: UserConnectionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserConnectionController],
    }).compile();

    controller = module.get<UserConnectionController>(UserConnectionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
