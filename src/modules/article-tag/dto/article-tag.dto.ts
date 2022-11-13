import { ArticleTag } from "@entities/article-tag.entity";
import { ApiProperty, PartialType } from "@nestjs/swagger";
import { BaseResponseTypeDTO } from "@utils/types/utils.types";

export class ArticleTagResponseDTO extends BaseResponseTypeDTO{
    data : ArticleTag | ArticleTag[]
}

export class CreateArticleTagDTO {

    @ApiProperty()
    articleId : string;

    @ApiProperty()
    interestId : string;
}

export class UpdateArticleTagDTO extends PartialType(CreateArticleTagDTO) {
    
    @ApiProperty()
    id : string;

    @ApiProperty()
    status ?: boolean;
}


