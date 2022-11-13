import { Body, Controller, Get , Param, ParseUUIDPipe, Post, UseGuards} from '@nestjs/common';
import { ApiConsumes, ApiOperation, ApiProduces, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '@schematics/decorators/custom.decorator';
import { RolesGuard } from '@schematics/guards/roles.guard';
import { DecodedTokenKey } from '@utils/types/utils.constant';
import { ArticleCommentService } from './article-comment.service';
import { ArticleCommentResponseDTO, ArticleCommentsResponseDTO, CreateArticleCommentDTO } from './dto/article-comment.dto';

@ApiTags('article-comment')
@UseGuards(RolesGuard)
@Controller('article-comment')
export class ArticleCommentController {

    constructor(
        private readonly articleCommentService : ArticleCommentService
    ){}
    
    @ApiOperation({
        description : "Create comment under article"
    })
    @ApiProduces('json')
    @ApiResponse({type : () => ArticleCommentResponseDTO})
    @Get(':id')
    async findCommentById(@Param('id', ParseUUIDPipe) id : string) : Promise<ArticleCommentResponseDTO>{
        return this.articleCommentService.findCommentById(id);
    }

    @ApiOperation({
        description : "Find all comments under article"
    })
    @ApiProduces('json')
    @ApiResponse({type : () => [ArticleCommentsResponseDTO]})
    @Get('/find-comments-under-article-by-id/:articleId')
    async findAllArticleComments(@Param('articleId') articleId : string) : Promise<ArticleCommentsResponseDTO>{ 
        return await this.articleCommentService.findCommentsUnderArticle(articleId);
    }

    @ApiOperation({
        description : "Create comment under article"
    })
    @ApiProduces('json')
    @ApiConsumes('application/json')
    @ApiResponse({type : () => ArticleCommentResponseDTO})
    @Post()
    async createArticleComments(@Body() payload : CreateArticleCommentDTO,
    @CurrentUser(DecodedTokenKey.USER_ID) userId : string) : Promise<ArticleCommentResponseDTO>{
        return await this.articleCommentService.createComment(payload, userId);
    }

}
