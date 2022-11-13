import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiOperation,
  ApiProduces,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CurrentUser } from '@schematics/decorators/custom.decorator';
import { RolesGuard } from '@schematics/guards/roles.guard';
import { DecodedTokenKey } from '@utils/types/utils.constant';
import { BaseResponseTypeDTO } from '@utils/types/utils.types';
import {
  CreateUserInterestDTO,
  UserInterestResponseDTO,
  UserInterestsResponseDTO,
} from './dto/user-interest.dto';
import { UserInterestService } from './user-interest.service';

@ApiTags('user-interest')
@Controller('user-interest')
export class UserInterestController {
  constructor(private readonly userInterestSrv: UserInterestService) {}

  @ApiOperation({ description: "Create user's interest" })
  @ApiProduces('json')
  @ApiConsumes('application/json')
  @ApiResponse({ type: UserInterestsResponseDTO })
  @Post()
  async createUserInterest(
    @Body() payload: CreateUserInterestDTO,
  ): Promise<UserInterestsResponseDTO> {
    return await this.userInterestSrv.createUserInterest(payload);
  }

  @ApiOperation({ description: "Update user's interest" })
  @ApiProduces('json')
  @ApiConsumes('application/json')
  @ApiResponse({ type: BaseResponseTypeDTO })
  @Patch()
  async updateUserInterest(
    @Body() payload: CreateUserInterestDTO,
  ): Promise<BaseResponseTypeDTO> {
    return await this.userInterestSrv.updateUserInterests(payload);
  }

  @ApiOperation({ description: "Find user's interest by id" })
  @ApiProduces('json')
  @ApiConsumes('application/json')
  @ApiResponse({ type: UserInterestsResponseDTO })
  @Get('/:userInterestId')
  async findUserInterestById(
    @Param('userInterestId', ParseUUIDPipe) userInterestId,
  ): Promise<UserInterestResponseDTO> {
    return await this.userInterestSrv.findUserInterestById(userInterestId);
  }

  @ApiOperation({ description: "Find user's interests" })
  @ApiProduces('json')
  @ApiConsumes('application/json')
  @ApiResponse({ type: UserInterestsResponseDTO })
  @ApiBearerAuth('JWT')
  @UseGuards(RolesGuard)
  @Get('/find-user-interests/by-userId')
  async findUserInterests(
    @CurrentUser(DecodedTokenKey.USER_ID) userId: string,
  ): Promise<UserInterestsResponseDTO> {
    return await this.userInterestSrv.findUserInterests(userId);
  }
}
