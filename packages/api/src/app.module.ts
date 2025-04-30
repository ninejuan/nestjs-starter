import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { PrismaService } from './common/prisma/prisma.service';
import { PrismaModule } from './common/prisma/prisma.module';
import { UserService } from './user/user.service';
import { UserModule } from './user/user.module';
import { MinioModule } from './minio/minio.module';
import { ConfigModule } from '@nestjs/config';

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
  ],
  providers: [PrismaService, UserService],
})
export class AppModule {}
