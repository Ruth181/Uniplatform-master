import { PostCommentReply } from "@entities/post-comment-reply.entity";
import { ApiProperty } from "@nestjs/swagger";
import { BaseResponseTypeDTO } from "@utils/types/utils.types";

export class CreatePostCommentReplyDTO{
    @ApiProperty({type : 'uuid'})
    postCommentId : string;

    @ApiProperty()
    text : string;
}


export class PostCommentReplyResponseDTO extends BaseResponseTypeDTO{
    @ApiProperty({type : () => PostCommentReply})
    data?: PostCommentReply;
}

export class PostCommentRepliesResponseDTO extends BaseResponseTypeDTO{
    @ApiProperty({type : () => [PostCommentReply]})
    data?: PostCommentReply[]; 
}