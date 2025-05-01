import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsString } from 'class-validator';

export class CreateHelloDto {
  @IsString()
  @ApiProperty({
    description: 'foo 필드입니다',
    example: 'foo value',
  })
  foo: string;

  @IsString()
  @ApiProperty({
    description: 'bar 필드입니다',
    example: 'bar value',
    required: false,
  })
  bar: string;

  @IsBoolean()
  @ApiProperty({
    description: 'isHello 필드입니다',
    example: true,
  })
  isHello: boolean;
}
