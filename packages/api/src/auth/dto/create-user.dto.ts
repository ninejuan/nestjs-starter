import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsString } from 'class-validator';
import { Permission as PermissionEnum } from '@/common/enums/Permission.enum';

export class CreateUserDto {
  @IsEmail()
  @ApiProperty({
    description: '사용자 이메일',
    example: 'user@example.com',
  })
  email: string;

  @IsString()
  @ApiProperty({
    description: '사용자 이름',
    example: '홍길동',
  })
  name: string;

  @IsString()
  @ApiProperty({
    description: '사용자 프로필 사진',
    example: 'https://example.com/profile.jpg',
  })
  profilePhoto: string;

  @IsEnum(PermissionEnum)
  @ApiProperty({
    description: '사용자 권한 (선택)',
    example: 'USER',
    enum: ['ADMIN', 'USER'],
    items: { type: 'string' },
    required: false,
  })
  permission?: string;
}
