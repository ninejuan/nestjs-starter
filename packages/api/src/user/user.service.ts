import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Permission as PrismaPermission } from '@your-organization/database';
import { Permission as PermissionEnum } from '@/common/enums/Permission.enum';
import { UserRepository } from './repository/user.repo';
import { ChangePermissionDto } from './dto/change-permission.dto';
import { DeleteAccountDto } from './dto/delete-account.dto';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async findUserByEmail(email: string) {
    const user = await this.userRepository.findUserByEmail(email);
    if (!user) {
      throw new NotFoundException('사용자를 찾을 수 없습니다.');
    }
    return user;
  }

  async createUser(
    email: string,
    name: string,
    permission: PermissionEnum = PermissionEnum.USER,
  ) {
    const existingUser = await this.userRepository.findUserByEmail(email);
    if (existingUser) {
      throw new ConflictException('계정이 이미 존재합니다.');
    }

    return this.userRepository.createUser(
      email,
      name,
      PrismaPermission[permission],
    );
  }

  async changePermission(dto: ChangePermissionDto) {
    // await this.findUserByEmail(dto.email);
    // return this.userRepository.changePermission(dto.email, dto.newPermission);
  }

  async deleteAccount(dto: DeleteAccountDto) {
    await this.findUserByEmail(dto.email);
    return this.userRepository.deleteAccount(dto.email);
  }
}
