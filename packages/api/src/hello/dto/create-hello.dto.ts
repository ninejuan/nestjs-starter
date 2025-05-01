import { ApiProperty } from '@nestjs/swagger';

export class CreateHelloDto {
  @ApiProperty({
    description: 'foo 필드입니다',
    example: 'foo value',
  })
  foo: string;

  @ApiProperty({
    description: 'bar 필드입니다',
    example: 'bar value',
    required: false,
  })
  bar: string;

  @ApiProperty({
    description: 'isHello 필드입니다',
    example: true,
  })
  isHello: boolean;
}
