import { Injectable, InternalServerErrorException } from '@nestjs/common'
import { PrismaService } from '@/common/prisma/prisma.service'

@Injectable()
export class TokenRepository {
  constructor(private readonly prismaService: PrismaService) {}
  async setRefreshToken(email: string, refreshToken: string) {
    try {
      return await this.prismaService.user.update({
        where: { email },
        data: { refreshToken },
      })
    }
    catch {
      throw new InternalServerErrorException()
    }
  }

  async removeRefreshToken(email: string) {
    try {
      return await this.prismaService.user.update({
        where: { email },
        data: { refreshToken: null },
      })
    }
    catch {
      throw new InternalServerErrorException()
    }
  }
}
