import {
  Controller,
  Delete,
  Post,
  SetMetadata,
  UseGuards,
  Body,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { UserService } from './user.service';
import { ChangePermissionDto } from './dto/changeInformations.dto';
import { AdminGuard } from '@/auth/guards/admin.guard';

@Controller('user')
@SetMetadata('permission', 'ADMIN')
@UseGuards(AdminGuard)
@ApiBearerAuth()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({ summary: '권한 변경' })
  @ApiResponse({ type: Boolean })
  @Post('/permission/change')
  async changePermission(@Body() changePermissionDto: ChangePermissionDto) {
    return await this.userService.changePermission(
      changePermissionDto.email,
      changePermissionDto.newPermission,
    );
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
    return await this.userService.deleteAccount(email);
  }
}
