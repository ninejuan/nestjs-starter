import { ApiProperty } from '@nestjs/swagger'
import { Permission } from '@/common/enums/Permission.enum'
import { IsEnum, IsString } from 'class-validator'

export class ChangePasswordDto {
  @ApiProperty({
    description: '사용자 이메일',
    example: 'user@example.com',
  })
  @IsString()
  email: string

  @ApiProperty({
    description: '새로운 비밀번호',
    example: 'newPassword123',
  })
  @IsString()
  newPassword: string
}

export class ChangePermissionDto {
  @ApiProperty({
    description: '사용자 이메일',
    example: 'user@example.com',
  })
  @IsString()
  email: string

  @ApiProperty({
    description: '새로운 권한',
    example: 'USER',
    enum: Permission,
  })
  @IsEnum(Permission)
  newPermission: Permission
}
