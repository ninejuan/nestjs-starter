import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

export class DeleteAccountDto {
  @IsEmail()
  @ApiProperty({
    description: '삭제할 계정의 이메일',
    example: 'user@example.com',
  })
  email: string;
}
