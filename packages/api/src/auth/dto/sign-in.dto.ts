import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsString } from 'class-validator'

export class SignInDto {
  @IsEmail()
  @ApiProperty({
    description: '사용자 이메일',
    example: 'user@example.com',
  })
  email: string

  @IsString()
  @ApiProperty({
    description: '사용자 비밀번호',
    example: 'password123',
  })
  password: string
}
