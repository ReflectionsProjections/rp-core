import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet';
import * as cookieParser from 'cookie-parser';
import { debug } from 'debug';

require('dotenv').config();
// process.env.DEBUG = 'aws-sdk:*';
// const logger = debug('aws-sdk');
process.env.AWS_SDK_LOAD_CONFIG = '1';

async function bootstrap() {
  // Enable AWS SDK logging
  process.env.DEBUG = 'aws-sdk:*';

  // Create a logger instance
  const logger = debug('aws-sdk');
  const app = await NestFactory.create(AppModule);
  app.use(helmet());
  app.use(cookieParser());
  app.enableCors();
  logger('Application starting...');
  // app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  await app.listen(3000);
  logger('Application listening on port 3000');
}
bootstrap();
