import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';
import { PrismaService } from '@/common/prisma/prisma.service';
import { HttpExceptionFilter } from '@/common/filters/http-exception.filter';
import { PrismaExceptionFilter } from '@/common/filters/prisma-exception.filter';
import { Logger, ValidationPipe } from '@nestjs/common';
import { SwaggerTheme, SwaggerThemeNameEnum } from 'swagger-themes';
import { FooBarPipe } from './common/pipes/foo.pipe';
import { ConfigService } from '@nestjs/config';
import cookieParser from 'cookie-parser';

import './instrument';

const logger = new Logger('bootstrap');

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const configService = app.get(ConfigService);

  app.use(cookieParser());

  app.useGlobalFilters(new HttpExceptionFilter(), new PrismaExceptionFilter());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
      forbidNonWhitelisted: true,
    }),
    new FooBarPipe(),
  );

  app.enableCors({
    origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
    credentials: true,
    allowedHeaders: [
      'Content-Type',
      'Accept',
      'Authorization',
      'Set-Cookie',
      'Cookie',
    ],
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
  });

  const prismaService = app.get(PrismaService);
  await prismaService.enableShutdownHooks(app);

  const swaggerTheme = new SwaggerTheme().getBuffer(SwaggerThemeNameEnum.DARK);

  const config = new DocumentBuilder()
    .setTitle(configService.get<string>('NAME'))
    .setDescription(configService.get<string>('DESCRIPTION'))
    .setVersion(configService.get<string>('VERSION'))
    .addCookieAuth('accessToken', { type: 'apiKey', in: 'cookie' })
    .addCookieAuth('refreshToken', { type: 'apiKey', in: 'cookie' })
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api-docs', app, document, {
    jsonDocumentUrl: 'api-docs/json',
    explorer: true,
    yamlDocumentUrl: 'api-docs/yaml',
    customCss: swaggerTheme,
    customfavIcon: 'https://s3.juany.dev/pkg/imgs/sigmd/favicon.png',
    customSiteTitle: 'NestJs API Swagger',
  });

  await app.listen(configService.get<number>('PORT') ?? 3000, '0.0.0.0');
}

bootstrap()
  .then(() =>
    logger.log(
      `✅ NestJS API is running on http://${new ConfigService().get<string>('DOMAIN')}`,
    ),
  )
  .catch((error) => logger.error('❌ Failed to start NestJS API:', error));
