import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsEnum, IsOptional, IsString, Length } from 'class-validator'
import { Permission as PermissionEnum } from '@/common/enums/Permission.enum'

export class CreateUserDto {
  @IsEmail()
  @ApiProperty({
    description: '사용자 이메일',
    example: 'user@example.com',
  })
  email: string

  @IsString()
  @IsOptional()
  @Length(6, 20)
  @ApiProperty({
    description: '사용자 비밀번호 (선택)',
    example: 'password123',
    required: false,
  })
  password?: string

  @IsString()
  @ApiProperty({
    description: '사용자 이름',
    example: '홍길동',
  })
  name: string

  @IsEnum(PermissionEnum)
  @ApiProperty({
    description: '사용자 권한 (선택)',
    example: 'USER',
    enum: [
      'SUPER', 'MODERATOR', 'MANAGER', 'USER',
    ],
    items: { type: 'string' },
    required: false,
  })
  permission?: string
}
