import { Global, Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserRepository } from './repository/user.repo';
import { UserService } from './user.service';
import { ConfigService } from '@nestjs/config';

@Global()
@Module({
  providers: [UserRepository, UserService, ConfigService],
  controllers: [UserController],
  exports: [UserService, UserRepository, ConfigService],
})
export class UserModule {}
