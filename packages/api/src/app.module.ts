import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { PrismaService } from './common/prisma/prisma.service';
import { PrismaModule } from './common/prisma/prisma.module';
import { UserService } from './user/user.service';
import { UserModule } from './user/user.module';
import { MinioModule } from './minio/minio.module';
import { ConfigModule } from '@nestjs/config';
import { HelloModule } from './hello/hello.module';
import { SentryGlobalFilter, SentryModule } from '@sentry/nestjs/setup';
import { APP_FILTER } from '@nestjs/core';

@Module({
  imports: [
    SentryModule.forRoot(),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', '.env.development'],
    }),
    AuthModule,
    PrismaModule,
    UserModule,
    MinioModule,
    HelloModule,
  ],
  providers: [
    PrismaService,
    UserService,
    // Sentry를 사용할 경우, 아래 코드의 주석을 해제하세요.
    // {
    //   provide: APP_FILTER,
    //   useClass: SentryGlobalFilter,
    // },
  ],
})
export class AppModule {}
