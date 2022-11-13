import {
  Body,
  Controller,
  Get,
  Param,
  ParseBoolPipe,
  ParseUUIDPipe,
  Patch,
  Query,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiConsumes,
  ApiOperation,
  ApiProduces,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { BaseResponseTypeDTO } from '@utils/types/utils.types';
import { MulterValidators } from '@utils/validators/multer.validator';
import { diskStorage } from 'multer';
import {
  CreateInterestDTO,
  InterestResponseDTO,
  InterestsResponseDTO,
  UpdateInterestDTO,
} from './dto/interest.dto';
import { InterestService } from './interest.service';

@ApiTags('interest')
@Controller('interest')
export class InterestController {
  constructor(private readonly interestSrv: InterestService) {}

  @ApiOperation({
    description: 'Create interest',
  })
  @ApiProduces('json')
  @ApiConsumes('application/json')
  @ApiResponse({
    type: InterestResponseDTO,
  })
  @Post()
  async createInterest(
    @Body() payload: CreateInterestDTO,
  ): Promise<InterestResponseDTO> {
    return await this.interestSrv.createInterest(payload);
  }

  @UseInterceptors(
    FileInterceptor('excelSheet', {
      storage: diskStorage({
        destination: './uploads',
        filename: MulterValidators.preserveOriginalFileName,
      }),
      fileFilter: MulterValidators.excelFileFilter,
    }),
  )
  @Post('/create-bulk')
  async createInterestsInBulk(
    @UploadedFile() excelSheet: Express.Multer.File,
  ): Promise<InterestsResponseDTO> {
    const path = `uploads/${excelSheet.filename}`;
    return await this.interestSrv.createInterestsInBulk(path);
  }

  @ApiOperation({
    description: 'Find all interests',
  })
  @ApiProduces('json')
  @ApiConsumes('application/json')
  @ApiResponse({
    type: InterestsResponseDTO,
  })
  @Get()
  async findInterests(): Promise<InterestsResponseDTO> {
    return await this.interestSrv.findInterests();
  }

  @ApiOperation({ description: 'Search for interests' })
  @ApiProduces('json')
  @ApiConsumes('application/json')
  @ApiResponse({ type: InterestsResponseDTO })
  @Get('/search-interests')
  async searchForInterests(
    @Query('searchTerm') searchTerm: string,
  ): Promise<InterestsResponseDTO> {
    return await this.interestSrv.searchForInterests(searchTerm);
  }

  @ApiOperation({
    description: 'Find interests by status',
  })
  @ApiProduces('json')
  @ApiConsumes('application/json')
  @ApiResponse({
    type: InterestsResponseDTO,
  })
  @Get('/find-by-status/:status')
  async findInterestsByStatus(
    @Param('status', ParseBoolPipe) status: boolean,
  ): Promise<InterestsResponseDTO> {
    return await this.interestSrv.findInterestsByStatus(status);
  }

  @ApiOperation({
    description: 'Find interest by id',
  })
  @ApiProduces('json')
  @ApiConsumes('application/json')
  @ApiResponse({
    type: InterestResponseDTO,
  })
  @Get('/:interestId')
  async findInterestById(
    @Param('interestId', ParseUUIDPipe) interestId: string,
  ): Promise<InterestResponseDTO> {
    return await this.interestSrv.findInterestById(interestId);
  }

  @ApiOperation({
    description: 'Update interest',
  })
  @ApiProduces('json')
  @ApiConsumes('application/json')
  @ApiResponse({ type: BaseResponseTypeDTO })
  @Patch()
  async updateInterest(
    @Body() payload: UpdateInterestDTO,
  ): Promise<BaseResponseTypeDTO> {
    return await this.interestSrv.updateInterest(payload);
  }
}
