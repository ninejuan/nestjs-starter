import { forwardRef, Module } from '@nestjs/common'
import { AuthService } from './auth.service'
import { AuthController } from './auth.controller'
import { PassportModule } from '@nestjs/passport'
import { JwtModule } from '@nestjs/jwt'
import { PrismaService } from '@/common/prisma/prisma.service'
import { JwtStrategy } from './strategies/jwt.strategy'
import { GoogleStrategy } from './strategies/google.strategy'
import { TokenRepository } from './repository/token.repo'
import { UserModule } from '@/user/user.module'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { HttpModule } from '@nestjs/axios'

@Module({
  imports: [
    forwardRef(() => UserModule),
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '2h' },
      }),
    }),
    HttpModule.registerAsync({
      useFactory: () => ({ baseURL: 'https://www.googleapis.com' }),
    }),
  ],
  controllers: [AuthController],
  providers: [
    TokenRepository,
    AuthService,
    JwtStrategy,
    GoogleStrategy,
    PrismaService,
  ],
  exports: [
    AuthService, JwtModule, TokenRepository, HttpModule,
  ],
})
export class AuthModule {}
