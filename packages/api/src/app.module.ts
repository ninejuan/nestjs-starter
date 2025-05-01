import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { PrismaService } from './common/prisma/prisma.service';
import { PrismaModule } from './common/prisma/prisma.module';
import { UserService } from './user/user.service';
import { UserModule } from './user/user.module';
import { MinioModule } from './minio/minio.module';
import { ConfigModule } from '@nestjs/config';
import { HelloModule } from './hello/hello.module';

@Module({
  imports: [
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
  providers: [PrismaService, UserService],
})
export class AppModule {}
