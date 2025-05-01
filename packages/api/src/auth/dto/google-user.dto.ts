import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, Matches } from 'class-validator';

export class GoogleUserDto {
  @IsEmail()
  @ApiProperty({
    description: 'Google 계정 이메일',
    example: 'user@gmail.com',
  })
  email: string;

  @IsString()
  @Matches(/^ya29\.[a-zA-Z0-9_-]+$/, {
    message: '유효하지 않은 Google 액세스 토큰입니다.',
  })
  @ApiProperty({
    description: 'Google OAuth 액세스 토큰',
    example: 'ya29.a0AfH6SMB...',
  })
  accessToken: string;
}
