import { PostLike } from '@entities/post-like.entity';
import {
  BadRequestException,
  HttpStatus,
  Injectable,
  NotImplementedException,
} from '@nestjs/common';
import { GenericService } from '@schematics/services/generic.service';
import { checkForRequiredFields } from '@utils/functions/utils.function';
import {
  CreatePostLikeDTO,
  PostLikeResponseDTO,
  PostLikesCountResponseDTO,
} from './dto/post-like.dto';

@Injectable()
export class PostLikeService extends GenericService(PostLike) {
  //create and return count

  async createPostLike(
    payload: CreatePostLikeDTO,
    userId: string,
  ): Promise<PostLikeResponseDTO> {
    try {
      checkForRequiredFields(['postId'], payload);
      if (!userId) {
        throw new BadRequestException("Field 'userId' is Required");
      }
      const doesLikeExist = await this.getRepo().findOne({
        where: [{ userId }, { postId: payload.postId }],
      });
      if (doesLikeExist) {
        await this.getRepo().delete({ id: doesLikeExist.id });
      }
      const data = await this.create<Partial<PostLike>>({
        ...payload,
        userId,
      });

      if (!data) {
        throw new NotImplementedException('POST REQUEST FAILED');
      }

      return {
        code: HttpStatus.CREATED,
        data,
        message: 'POST lIKE ADDED',
        success: true,
      };
    } catch (ex) {
      throw ex;
    }
  }

  async findTotalLikesForPost(
    postId: string,
  ): Promise<PostLikesCountResponseDTO> {
    try {
      if (!postId) {
        throw new BadRequestException("Field 'postId' is Required");
      }

      const [data, count] = await Promise.all([
        this.getRepo().find({ where: [{ postId }] }),
        this.getRepo().count(),
      ]);
      return {
        code: HttpStatus.OK,
        data,
        count,
        message: 'REQUEST SUCCESSFUL',
        success: true,
      };
    } catch (ex) {
      throw ex;
    }
  }
}
