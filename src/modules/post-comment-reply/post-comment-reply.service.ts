import { PostCommentReply } from '@entities/post-comment-reply.entity';
import { BadRequestException, HttpStatus, Injectable, NotFoundException, NotImplementedException } from '@nestjs/common';
import { GenericService } from '@schematics/services/generic.service';
import { checkForRequiredFields } from '@utils/functions/utils.function';
import { BaseResponseTypeDTO } from '@utils/types/utils.types';
import { CreatePostCommentReplyDTO, PostCommentRepliesResponseDTO, PostCommentReplyResponseDTO } from './dto/post-comment-reply.dto';

@Injectable()
export class PostCommentReplyService extends GenericService(PostCommentReply) {

    
    async createReply(payload : CreatePostCommentReplyDTO, userId : string) : Promise<PostCommentReplyResponseDTO>{
        try {
            checkForRequiredFields(['postCommentId','text'], payload);
            if(!userId){
                throw new BadRequestException("Field 'userId' is Required");
            }

            const data : PostCommentReply = await this.create<Partial<PostCommentReply>>({
                userId,
                ...payload
            });
            if(!data){
                throw new NotImplementedException("POST REQUEST FAILED");
            }
            return{
                code : HttpStatus.CREATED,
                data,
                message : "REPLY CREATED",
                success : true
            };
        } catch (ex) {
            throw ex;
        }
    }

     //get all reply on postcomment
    async findRepliesUnderComment(postCommentId : string) : Promise<PostCommentRepliesResponseDTO>{
        try {
            if(!postCommentId){
                throw new BadRequestException("Field 'postCommentId' is Required");
            }

            const replies : PostCommentReply[] = await this.findAllByCondition({postCommentId});
            return{
                code : HttpStatus.OK,
                data : replies,
                message : "REQUEST SUCCESSFUL",
                success : true
            };
        } catch (ex) {
            throw ex;
        }
    }
    //get comments under user and postComment id
    async findRepliesMadeByUserForPostComment(
        userId : string, 
        postCommentId : string) : Promise<PostCommentRepliesResponseDTO>{
            try {
                if(!userId || !postCommentId){
                    throw new BadRequestException("Fields 'userId', 'postCommentId' are Required");
                }

                const userCommentReplies : PostCommentReply[] = await this.findAllByCondition({userId, postCommentId});
                return{
                    code : HttpStatus.OK,
                    data : userCommentReplies,
                    message : "REQUEST SUCCESSFUL",
                    success : true
                };
            } catch (ex) {
                throw ex;
            }

    }
    //delete comment
    async deleteCommentReplyById(postCommentReplyId : string) : Promise<BaseResponseTypeDTO>{
        try {
            if(!postCommentReplyId){
                throw new BadRequestException("Field 'postCommentReplyId' is Required");
            }

            const reply : PostCommentReply = await this.getRepo().findOne({where : [{id : postCommentReplyId}]});
            if(!reply){
                throw new NotFoundException("postCommentReplyId Not Found");
            }
            await this.getRepo().delete(postCommentReplyId);
            return{
                code : HttpStatus.OK,
                message : "DELETE SUCCESSFUL",
                success : true
            };
        } catch (ex) {
            throw ex;
        }
    }
}
