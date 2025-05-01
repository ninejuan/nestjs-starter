import { Permission as PermissionEnum } from '@/common/enums/Permission.enum';
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsNotEmpty, IsString } from 'class-validator';

export class JwtPayload {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: '사용자 고유 UUID',
    example: 'user-uuid',
  })
  id: string;

  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({
    description: '사용자 이메일',
    example: 'user@example.com',
  })
  email: string;

  @IsEnum(PermissionEnum)
  @IsNotEmpty()
  @ApiProperty({
    description: '사용자 권한',
    example: 'USER',
    enum: ['SUPER', 'MODERATOR', 'MANAGER', 'USER'],
    items: { type: 'string' },
  })
  permission: string;
}
