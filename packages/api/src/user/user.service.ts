import {
  ConflictException,
  ForbiddenException,
  forwardRef,
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common'
import { Permission as PrismaPermission } from '@sunrin-para/database'
import * as bcrypt from 'bcryptjs'
import { Permission as PermissionEnum } from '@/common/enums/Permission.enum'
import { UserRepository } from './repository/user.repo'
import { ConfigService } from '@nestjs/config'
import { AuthService } from '@/auth/auth.service'

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly configService: ConfigService,
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,
  ) {}

  async findUserByEmail(email: string) {
    return await this.userRepository.findUserByEmail(email)
  }

  private async integrateAccount(
    email: string,
    adminPermission: PermissionEnum,
    password: string,
  ) {
    await this.userRepository.changePermission(email, adminPermission)
    await this.userRepository.changePassword(email, password)
    return this.findUserByEmail(email)
  }

  async createUser(
    email: string,
    name: string,
    permission: PermissionEnum = PermissionEnum['USER'],
    password?: string,
  ) {
    const user = await this.findUserByEmail(email)
    if (user?.password) throw new ConflictException('이미 계정이 존재합니다.')

    password = await bcrypt.hash(
      password,
      await bcrypt.genSalt(+this.configService.get('SALT_ROUND')),
    )

    return user
      ? await this.integrateAccount(email, permission, password)
      : await this.userRepository.createUser(
        email,
        name,
        PrismaPermission[permission],
        password,
      )
  }

  async getAccountList(type: string) {
    return await this.userRepository.getAccountList(type)
  }

  async changePassword(
    changerEmail: string,
    userEmail: string,
    newPassword: string,
  ) {
    try {
      const changer = await this.findUserByEmail(changerEmail)
      if (
        (changerEmail !== userEmail && changer?.permission !== 'SUPER')
        || !(await this.findUserByEmail(userEmail))
      ) {
        throw new ForbiddenException()
      }

      const encryptedPassword = await bcrypt.hash(
        newPassword,
        await bcrypt.genSalt(+this.configService.get('SALT_ROUND')),
      )
      await this.userRepository.changePassword(userEmail, encryptedPassword)
      await this.authService.signOut(userEmail)
      return true
    }
    catch {
      throw new InternalServerErrorException()
    }
  }

  async changePermission(email: string, newPermission: PermissionEnum) {
    return await this.userRepository.changePermission(email, newPermission)
  }

  async deleteAccount(email: string) {
    return await this.userRepository.deleteAccount(email)
  }
}
