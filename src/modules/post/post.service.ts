import { Post } from '@entities/post.entity';
import {
  BadRequestException,
  HttpStatus,
  Injectable,
  NotFoundException,
  NotImplementedException,
} from '@nestjs/common';
import { GenericService } from '@schematics/services/generic.service';
import {
  calculatePaginationControls,
  checkForRequiredFields,
} from '@utils/functions/utils.function';
import {
  BaseResponseTypeDTO,
  PaginationRequestType,
} from '@utils/types/utils.types';
import { DeleteResult, FindManyOptions } from 'typeorm';
import {
  CreatePostDTO,
  PostResponseDTO,
  PostsResponseDTO,
} from './dto/post.dto';

@Injectable()
export class PostService extends GenericService(Post) {
  private relations = [
    'user',
    'user.userProfiles',
    'user.userProfiles.institution',
    'user.userProfiles.department',
    'likesForThisPost',
    'likesForThisPost.user',
    'commentsForThisPost',
    'commentsForThisPost.user',
  ];

  async createNewPost(
    payload: CreatePostDTO,
    userId: string,
  ): Promise<PostResponseDTO> {
    try {
      checkForRequiredFields(['text'], payload);
      if (userId) {
        const post = await this.create<Partial<Post>>({
          userId,
          ...payload,
        });
        if (!post) {
          throw new NotImplementedException('POST WAS NOT SAVED');
        }

        return {
          code: HttpStatus.CREATED,
          data: post,
          message: 'POST CREATED',
          success: true,
        };
      } else {
        throw new BadRequestException("Field 'userId' is Required");
      }
    } catch (ex) {
      throw ex;
    }
  }

  async findPostsMadeByUser(
    userId: string,
    payload?: PaginationRequestType,
    status = true,
  ): Promise<PostsResponseDTO> {
    try {
      if (!userId) {
        throw new BadRequestException("Field 'userId' is Required");
      }
      if (payload?.pageNumber) {
        payload = {
          pageSize: parseInt(`${payload.pageSize}`),
          pageNumber: parseInt(`${payload.pageNumber}`),
        };
        const options: FindManyOptions = {
          take: payload.pageSize,
          skip: (payload.pageNumber - 1) * payload.pageSize,
          where: { userId, status },
          order: { dateCreated: 'DESC' },
          relations: this.relations,
        };
        const { response, paginationControl } =
          await calculatePaginationControls<Post>(
            this.getRepo(),
            options,
            payload,
          );
        return {
          success: true,
          message: 'REQUEST SUCCESSFUL',
          code: HttpStatus.OK,
          data: response,
          paginationControl: paginationControl,
        };
      }
      const data = await this.getRepo().find({
        where: { userId, status },
        order: { dateCreated: 'DESC' },
        relations: this.relations,
      });
      return {
        code: HttpStatus.OK,
        message: 'REQUEST SUCCESSFUL',
        data,
        success: true,
      };
    } catch (ex) {
      throw ex;
    }
  }

  async findAllPosts(
    payload?: PaginationRequestType,
  ): Promise<PostsResponseDTO> {
    try {
      if (payload?.pageNumber) {
        payload = {
          pageSize: parseInt(`${payload.pageSize}`),
          pageNumber: parseInt(`${payload.pageNumber}`),
        };
        const options: FindManyOptions = {
          take: payload.pageSize,
          skip: (payload.pageNumber - 1) * payload.pageSize,
          order: { dateCreated: 'DESC' },
          relations: this.relations,
        };
        const { response, paginationControl } =
          await calculatePaginationControls<Post>(
            this.getRepo(),
            options,
            payload,
          );
        return {
          success: true,
          message: 'REQUEST SUCCESSFUL',
          code: HttpStatus.OK,
          data: response,
          paginationControl: paginationControl,
        };
      }
      const data = await this.getRepo().find({
        order: { dateCreated: 'DESC' },
        relations: this.relations,
      });
      return {
        code: HttpStatus.OK,
        message: 'REQUEST SUCCESSFUL',
        data,
        success: true,
      };
    } catch (ex) {
      throw ex;
    }
  }

  async findPostById(postId: string): Promise<PostResponseDTO> {
    try {
      if (!postId) {
        throw new BadRequestException("Field 'postId' is Required");
      }
      const post: Post = await this.getRepo().findOne({
        where: [{ id: postId }],
        relations: this.relations,
      });
      return {
        code: HttpStatus.OK,
        data: post,
        message: 'REQUEST SUCCESSFUL',
        success: true,
      };
    } catch (ex) {
      throw ex;
    }
  }

  async deleteByPost(postId: string): Promise<BaseResponseTypeDTO> {
    try {
      if (!postId) {
        throw new BadRequestException("Field 'postId' is Required");
      }
      const post: Post = await this.getRepo().findOne({
        where: [{ id: postId }],
      });
      if (!post) {
        throw new NotFoundException('POST NOT FOUND');
      }
      const isDeleted: DeleteResult = await this.getRepo().delete(postId);
      if (isDeleted)
        return {
          code: HttpStatus.OK,
          message: 'POST DELETED',
          success: true,
        };
    } catch (ex) {
      throw ex;
    }
  }
}
