import { forwardRef, Global, Module } from '@nestjs/common'
import { UserController } from './user.controller'
import { UserRepository } from './repository/user.repo'
import { AuthService } from '@/auth/auth.service'
import { UserService } from './user.service'
import { ConfigService } from '@nestjs/config'
import { AuthModule } from '@/auth/auth.module'

@Global()
@Module({
  imports: [forwardRef(() => AuthModule)],
  providers: [
    UserRepository,
    UserService,
    ConfigService,
    AuthService,
  ],
  controllers: [UserController],
  exports: [
    UserService, UserRepository, ConfigService,
  ],
})
export class UserModule {}
