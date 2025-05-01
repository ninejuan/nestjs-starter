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
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UserService } from './user.service';
import { ChangePermissionDto } from './dto/change-permission.dto';
import { DeleteAccountDto } from './dto/delete-account.dto';
import { AdminGuard } from '@/auth/guards/admin.guard';

@ApiTags('User')
@Controller('user')
@SetMetadata('permission', 'ADMIN')
@UseGuards(AdminGuard)
@ApiBearerAuth('accessToken')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/permission/change')
  @ApiOperation({ summary: '권한 변경' })
  @ApiResponse({ type: Boolean })
  async changePermission(@Body() changePermissionDto: ChangePermissionDto) {
    return await this.userService.changePermission(changePermissionDto);
  }

  @Delete('/account')
  @ApiOperation({ summary: '계정 삭제' })
  @ApiResponse({ type: Boolean })
  async deleteAccount(@Body() dto: DeleteAccountDto) {
    return this.userService.deleteAccount(dto);
  }
}
