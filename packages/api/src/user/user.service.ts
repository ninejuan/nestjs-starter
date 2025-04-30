import {
  ConflictException,
  ForbiddenException,
  forwardRef,
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { Permission as PrismaPermission } from '@your-organization/database';
import * as bcrypt from 'bcryptjs';
import { Permission as PermissionEnum } from '@/common/enums/Permission.enum';
import { UserRepository } from './repository/user.repo';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '@/auth/auth.service';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly configService: ConfigService,
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,
  ) {}

  async findUserByEmail(email: string) {
    return await this.userRepository.findUserByEmail(email);
  }

  async createUser(
    email: string,
    name: string,
    permission: PermissionEnum = PermissionEnum['USER'],
  ) {
    const user = await this.findUserByEmail(email);
    if (user) throw new ConflictException('이미 계정이 존재합니다.');

    return (
      user ??
      (await this.userRepository.createUser(
        email,
        name,
        PrismaPermission[permission],
      ))
    );
  }

  async changePermission(email: string, newPermission: PermissionEnum) {
    return await this.userRepository.changePermission(email, newPermission);
  }

  async deleteAccount(email: string) {
    return await this.userRepository.deleteAccount(email);
  }
}
