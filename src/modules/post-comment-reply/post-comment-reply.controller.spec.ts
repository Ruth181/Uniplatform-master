import { Test, TestingModule } from '@nestjs/testing';
import { PostCommentReplyController } from './post-comment-reply.controller';

describe('PostCommentReplyController', () => {
  let controller: PostCommentReplyController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PostCommentReplyController],
    }).compile();

    controller = module.get<PostCommentReplyController>(PostCommentReplyController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
