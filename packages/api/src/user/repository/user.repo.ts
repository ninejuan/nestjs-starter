import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '@/common/prisma/prisma.service';
import { Permission as PrismaPermission } from '@your-organization/database';
import { Permission as PermissionEnum } from '@/common/enums/Permission.enum';

@Injectable()
export class UserRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async findUserByEmail(email: string) {
    try {
      return await this.prismaService.user.findUnique({
        where: { email },
      });
    } catch (error) {
      throw new InternalServerErrorException(
        '사용자 조회 중 오류가 발생했습니다.',
      );
    }
  }

  async createUser(email: string, name: string, permission: PrismaPermission) {
    try {
      return await this.prismaService.user.create({
        data: { email, name, permission },
      });
    } catch (error) {
      throw new InternalServerErrorException(
        '사용자 생성 중 오류가 발생했습니다.',
      );
    }
  }

  async changePermission(email: string, permission: PermissionEnum) {
    try {
      return await this.prismaService.user.update({
        where: { email },
        data: { permission: PrismaPermission[permission] },
      });
    } catch (error) {
      throw new InternalServerErrorException(
        '권한 변경 중 오류가 발생했습니다.',
      );
    }
  }

  async deleteAccount(email: string) {
    try {
      await this.prismaService.user.delete({
        where: { email },
      });
      return true;
    } catch (error) {
      throw new InternalServerErrorException(
        '계정 삭제 중 오류가 발생했습니다.',
      );
    }
  }
}
