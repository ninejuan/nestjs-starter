import {
  INestApplication,
  Injectable,
  OnModuleDestroy,
  OnApplicationShutdown,
  OnModuleInit,
} from '@nestjs/common';
import { PrismaClient } from '@your-organization/database';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy, OnApplicationShutdown
{
  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }

  async onApplicationShutdown(signal?: string) {
    console.log(`Application is shutting down... Signal: ${signal}`);
    await this.$disconnect();
  }

  async enableShutdownHooks(app: INestApplication) {
    process.on('SIGINT', async () => {
      await app.close();
    });
    process.on('SIGTERM', async () => {
      await app.close();
    });
  }
}
