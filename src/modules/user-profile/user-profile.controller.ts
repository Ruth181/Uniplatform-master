import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
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
import {
  CreateUserProfileDTO,
  UserProfileResponseDTO,
} from './dto/user-profile.dto';
import { UserProfileService } from './user-profile.service';

@ApiBearerAuth('JWT')
@ApiTags('user-profile')
@UseGuards(RolesGuard)
@Controller('user-profile')
export class UserProfileController {
  constructor(private readonly userProfileSrv: UserProfileService) {}

  @ApiOperation({ description: 'Create UserProfile with UserId' })
  @ApiProduces('json')
  @ApiConsumes('application/json')
  @ApiResponse({ type: () => UserProfileResponseDTO })
  @Post()
  async createUserProfile(
    @Body() payload: CreateUserProfileDTO,
    @CurrentUser(DecodedTokenKey.USER_ID) userId: string,
  ): Promise<UserProfileResponseDTO> {
    return await this.userProfileSrv.createUserProfile(payload, userId);
  }

  @ApiOperation({ description: 'Count participants in department' })
  @ApiProduces('json')
  @ApiConsumes('application/json')
  @Get('/count-department-participants/:departmentId')
  async findDepartmentCount(
    @Param('departmentId', ParseUUIDPipe) departmentId: string,
  ): Promise<number> {
    return await this.userProfileSrv.findDepartmentCount(departmentId);
  }

  @ApiOperation({ description: 'Find UserProfile with UserProfileId' })
  @ApiProduces('json')
  @ApiResponse({ type: () => UserProfileResponseDTO })
  @Get('/:userProfileId')
  async findUserProfileById(
    @Param('userProfileId', ParseUUIDPipe) userProfileId: string,
  ): Promise<UserProfileResponseDTO> {
    return await this.userProfileSrv.findByUserProfileById(userProfileId);
  }

  @ApiOperation({ description: 'Find UserProfile with UserId' })
  @ApiProduces('json')
  @ApiResponse({ type: () => UserProfileResponseDTO })
  @Get('/find-by-userId/:userId')
  async findUserProfileByUserId(
    @Param('userId', ParseUUIDPipe) userId: string,
  ): Promise<UserProfileResponseDTO> {
    return await this.userProfileSrv.findByUserProfileByUserId(userId);
  }

  // @Post('/id-card-verification')
  // @ApiOperation({description : "Add Id Verification to UserProfile"})
  // @ApiProduces('json')
  // @ApiConsumes('application/json')
  // @ApiResponse({type : () => UserProfileResponseDTO})
  // async addIdVerification(@Body() payload : CreateIDVerificationDTO,
  //  @CurrentUser(DecodedTokenKey.USER_ID) userId : string) : Promise<UserProfileResponseDTO>{
  //     return await this.userProfileSrv.addIdVerification(payload, userId)
  // }
}
