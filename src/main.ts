import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet';
import * as cookieParser from 'cookie-parser';
import { debug } from 'debug';

require('dotenv').config();
process.env.AWS_SDK_LOAD_CONFIG = '1';

async function bootstrap() {
  process.env.DEBUG = 'aws-sdk:*';
  const logger = debug('aws-sdk');
  const app = await NestFactory.create(AppModule);
  app.use(helmet());
  app.use(cookieParser());
  app.enableCors({
    credentials: true,
    origin: [
      'http://localhost:5173',
      'http://localhost:4173',
      'https://beta.reflectionsprojections.org',
      'https://reflectionsprojections.org',
    ],
    allowedHeaders: ['Content-Type', 'Set-Cookie'],
    exposedHeaders: ['Access-Control-Allow-Origin'],
  });
  // TODO: Look into interference with dto validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );
  await app.listen(3000);
}
bootstrap();
