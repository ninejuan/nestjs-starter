import { ApiProperty } from '@nestjs/swagger'
import { IsString } from 'class-validator'

export class TokenResponseDto {
  @IsString()
  @ApiProperty({
    description: '액세스 토큰',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9',
  })
  accessToken: string

  @IsString()
  @ApiProperty({
    description: '리프레시 토큰',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9',
  })
  refreshToken: string
}
