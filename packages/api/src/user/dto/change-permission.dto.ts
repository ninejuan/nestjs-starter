import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsString } from 'class-validator';
import { Permission } from '@/common/enums/Permission.enum';

export class ChangePermissionDto {
  @IsEmail()
  @ApiProperty({
    description: '권한을 변경할 사용자의 이메일',
    example: 'user@example.com',
  })
  email: string;

  // @IsEnum(Permission)
  // @ApiProperty({
  //   description: '변경할 권한',
  //   example: 'ADMIN',
  //   enum: Permission,
  // })
  // newPermission: Permission;
}
