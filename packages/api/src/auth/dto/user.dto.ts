import { Permission as PermissionEnum } from '@/common/enums/Permission.enum';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
} from 'class-validator';
import { Type } from 'class-transformer';

export class UserDataDto {
  @IsString()
  @ApiProperty({
    description: '사용자 고유 UUID',
    example: 'user-uuid',
  })
  uuid: string;

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
    description: '사용자 권한',
    example: 'USER',
    enum: ['ADMIN', 'USER'],
    items: { type: 'string' },
  })
  permission: string;

  @IsDateString()
  @Type(() => Date)
  @ApiProperty({
    description: '계정 생성일',
    example: '2024-01-01T00:00:00.000Z',
  })
  createdAt: Date;

  @IsDateString()
  @Type(() => Date)
  @ApiProperty({
    description: '계정 수정일',
    example: '2024-01-01T00:00:00.000Z',
  })
  updatedAt: Date;

  @IsOptional()
  @IsString()
  @ApiProperty({
    description: '리프레시 토큰',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    required: false,
  })
  refreshToken?: string;
}
