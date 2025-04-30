import {
  Controller,
  Delete,
  Post,
  Req,
  SetMetadata,
  UseGuards,
  Body,
  Get,
  Param,
} from '@nestjs/common'
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger'
import { UserService } from './user.service'
import {
  ChangePasswordDto,
  ChangePermissionDto,
} from './dto/changeInformations.dto'
import { AdminGuard } from '@/auth/guards/admin.guard'
import { UserDataDto } from '@/auth/dto/user.dto'

interface IRequest extends Request {
  user?: UserDataDto
}

@Controller('user')
@SetMetadata('permission', 'SUPER')
@UseGuards(AdminGuard)
@ApiBearerAuth()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({ summary: '계정 리스트 (admin, user)' })
  @ApiResponse({ type: UserDataDto, isArray: true })
  @Get('/account/all/:type')
  async getAccountList(@Param('type') type: string) {
    return await this.userService.getAccountList(type)
  }

  @ApiOperation({ summary: '비밀번호 변경' })
  @ApiResponse({ type: Boolean })
  @SetMetadata('permission', 'MANAGER')
  @Post('/password/change')
  async changePassword(
    @Body() changePasswordDto: ChangePasswordDto,
    @Req() req: IRequest,
  ) {
    return await this.userService.changePassword(
      req.user.email,
      changePasswordDto.email,
      changePasswordDto.newPassword,
    )
  }

  @ApiOperation({ summary: '권한 변경' })
  @ApiResponse({ type: Boolean })
  @Post('/permission/change')
  async changePermission(@Body() changePermissionDto: ChangePermissionDto) {
    return await this.userService.changePermission(
      changePermissionDto.email,
      changePermissionDto.newPermission,
    )
  }

  @ApiOperation({ summary: '계정 삭제' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: { email: { type: 'string' } },
    },
  })
  @ApiResponse({ type: Boolean })
  @Delete('/account')
  async deleteAccount(@Body('email') email: string) {
    return await this.userService.deleteAccount(email)
  }
}
