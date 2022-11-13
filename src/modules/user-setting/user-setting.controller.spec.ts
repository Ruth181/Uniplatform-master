import { Test, TestingModule } from '@nestjs/testing';
import { UserSettingController } from './user-setting.controller';

describe('UserSettingController', () => {
  let controller: UserSettingController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserSettingController],
    }).compile();

    controller = module.get<UserSettingController>(UserSettingController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
