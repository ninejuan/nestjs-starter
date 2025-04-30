import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';
import { PrismaService } from '@/common/prisma/prisma.service';
import { UnauthorizedExceptionFilter } from '@/common/filters/unauthorized.filter';
import { PrismaExceptionFilter } from '@/common/filters/prisma-exception.filter';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerTheme, SwaggerThemeNameEnum } from 'swagger-themes';
import { NegativeNumberPipe } from './common/pipes/negative-number.pipe';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const configService = new ConfigService();

  app.useGlobalFilters(
    new UnauthorizedExceptionFilter(),
    new PrismaExceptionFilter(),
  );
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
    new NegativeNumberPipe(),
  );

  app.enableCors({
    origin: [
      'http://localhost:3000',
      'http://127.0.0.1:3000',
      'https://sunrin-para.dev',
      'https://api.sunrin-para.dev',
      'https://apply.sunrin-para.dev',
      'https://internal.sunrin-para.dev',
    ],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Accept', 'Authorization', 'Set-Cookie'],
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
  });

  const prismaService = app.get(PrismaService);
  await prismaService.enableShutdownHooks(app);

  const config = new DocumentBuilder()
    .setTitle(configService.get<string>('NAME'))
    .setDescription(configService.get<string>('DESCRIPTION'))
    .setVersion(configService.get<string>('VERSION'))
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document, {
    jsonDocumentUrl: 'api-docs/json',
    explorer: true,
    yamlDocumentUrl: 'api-docs/yaml',
    customCss: new SwaggerTheme().getBuffer(SwaggerThemeNameEnum.DARK),
    customfavIcon:
      'https://raw.githubusercontent.com/sunrin-para/.github/refs/heads/main/profile/favicon.ico',
    customSiteTitle: 'PARA API Swagger',
  });

  await app.listen(configService.get<number>('PORT') ?? 3000, '0.0.0.0');
}

bootstrap()
  .then(() => console.log('PARA Web API Started successfully'))
  .catch((error) => console.error('Failed to start PARA Web API:', error));
