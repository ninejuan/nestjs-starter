import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsString } from 'class-validator'

export class GoogleUserDto {
  @IsEmail()
  @ApiProperty({
    description: '사용자 이메일',
    example: 'dev.juany@gmail.com',
  })
  email: string

  @IsString()
  @ApiProperty({
    description: '액세스 토큰',
    example: 'ya29.a0AfH6SMB',
  })
  accessToken: string
}
