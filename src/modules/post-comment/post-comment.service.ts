import { PostComment } from '@entities/post-comment.entity';
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
import { DeleteResult, FindManyOptions, UpdateResult } from 'typeorm';
import {
  CreatePostCommentDTO,
  PostCommentResponseDTO,
  PostCommentsResponseDTO,
  UpdatePostCommentDTO,
} from './dto/post-comment.dto';

@Injectable()
export class PostCommentService extends GenericService(PostComment) {
  private relations = [
    'user',
    'user.userProfiles',
    'user.userProfiles.institution',
    'user.userProfiles.department',
    'user.userSettings',
    'post',
    'post.likesForThisPost',
    'post.likesForThisPost.user',
  ];

  async createComment(
    payload: CreatePostCommentDTO,
    userId: string,
  ): Promise<PostCommentResponseDTO> {
    try {
      checkForRequiredFields(['postId', 'text'], payload);
      if (!userId) {
        throw new BadRequestException("Field 'userId' is Required");
      }
      const comment = await this.create<Partial<PostComment>>({
        ...payload,
        userId,
      });
      if (!comment) {
        throw new NotImplementedException('COMMENT NOT SAVED');
      }
      return {
        success: true,
        code: HttpStatus.CREATED,
        data: comment,
        message: 'COMMENT SAVED',
      };
    } catch (ex) {
      throw ex;
    }
  }

  async updateComment(
    payload: UpdatePostCommentDTO,
  ): Promise<BaseResponseTypeDTO> {
    try {
      checkForRequiredFields(['postCommentId'], payload);
      const { postCommentId, text } = payload;
      const comment: PostComment = await this.getRepo().findOne({
        where: { id: postCommentId },
      });
      if (!comment?.id) {
        throw new NotFoundException();
      }
      if ('status' in payload) {
        comment.status = payload.status;
      }
      if (text && comment.text !== text) {
        comment.text = text;
      }
      const updatedComment: Partial<PostComment> = {
        text: comment.text,
        status: comment.status,
      };
      await this.getRepo().update({ id: postCommentId }, updatedComment);
      return {
        code: HttpStatus.OK,
        message: 'UPDATE SUCCESSFUL',
        success: true,
      };
    } catch (ex) {
      throw ex;
    }
  }

  async findCommentsByUserId(
    userId: string,
    payload?: PaginationRequestType,
  ): Promise<PostCommentsResponseDTO> {
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
          where: { userId },
          order: { dateCreated: 'DESC' },
          relations: this.relations,
        };
        const { response, paginationControl } =
          await calculatePaginationControls<PostComment>(
            this.getRepo(),
            options,
            payload,
          );
        return {
          success: true,
          message: 'Users found',
          code: HttpStatus.OK,
          data: response,
          paginationControl: paginationControl,
        };
      }
      const data = await this.getRepo().find({
        where: { userId },
        order: { dateCreated: 'DESC' },
        relations: this.relations,
      });
      return {
        code: HttpStatus.OK,
        message: 'COMMENTS FOUND',
        data,
        success: true,
      };
    } catch (ex) {
      throw ex;
    }
  }

  async findCommentsUnderPost(
    postId: string,
    payload?: PaginationRequestType,
  ): Promise<PostCommentsResponseDTO> {
    try {
      if (!postId) {
        throw new BadRequestException("Field 'postId' is Required");
      }
      if (payload?.pageNumber) {
        payload = {
          pageSize: parseInt(`${payload.pageSize}`),
          pageNumber: parseInt(`${payload.pageNumber}`),
        };
        const options: FindManyOptions = {
          take: payload.pageSize,
          skip: (payload.pageNumber - 1) * payload.pageSize,
          where: { postId },
          order: { dateCreated: 'DESC' },
          relations: this.relations,
        };
        const { response, paginationControl } =
          await calculatePaginationControls<PostComment>(
            this.getRepo(),
            options,
            payload,
          );
        return {
          success: true,
          message: 'Users found',
          code: HttpStatus.OK,
          data: response,
          paginationControl: paginationControl,
        };
      }
      const data = await this.getRepo().find({
        where: { postId },
        order: { dateCreated: 'DESC' },
        relations: this.relations,
      });
      return {
        code: HttpStatus.OK,
        message: 'COMMENTS FOUND',
        data,
        success: true,
      };
    } catch (ex) {
      throw ex;
    }
  }

  //delete comment
  async deleteByPostComment(id: string): Promise<BaseResponseTypeDTO> {
    try {
      if (!id) {
        throw new BadRequestException("Field 'id' is Required");
      }
      const comment: PostComment = await this.getRepo().findOne({
        where: [{ id }],
      });
      if (!comment) {
        throw new NotFoundException('ID NOT FOUND');
      }
      const isDeleted: DeleteResult = await this.getRepo().delete(id);
      if (isDeleted)
        return {
          code: HttpStatus.OK,
          message: 'COMMENT DELETED',
          success: true,
        };
    } catch (ex) {
      throw ex;
    }
  }
}
