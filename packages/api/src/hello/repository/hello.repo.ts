import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '@/common/prisma/prisma.service';

@Injectable()
export class HelloRepository {
  constructor(private readonly prismaService: PrismaService) {}
  async getFoo(foo: string) {
    try {
      return await this.prismaService.hello.findUnique({
        where: { foo },
      });
    } catch (error) {
      throw new InternalServerErrorException(
        'Foo 조회 중 오류가 발생했습니다.',
      );
    }
  }
}
