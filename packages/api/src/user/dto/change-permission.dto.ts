import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsString } from 'class-validator';
import { Transform } from 'class-transformer';
import { Permission } from '@/common/enums/Permission.enum';

export class ChangePermissionDto {
  @IsEmail()
  @ApiProperty({
    description: '권한을 변경할 사용자의 이메일',
    example: 'user@example.com',
  })
  email: string;

  @Transform(({ value }) => Permission[value])
  @IsEnum(Permission)
  @ApiProperty({
    description: '변경할 권한 (0: ADMIN, 1: USER)',
    example: 1,
    enum: Permission,
  })
  newPermission: Permission;
}
