import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(helmet());
  app.use(cookieParser());
  app.enableCors({
    credentials: true,
    origin: ['http://localhost:5173', 'http://dev.reflectionsprojections.org'],
    allowedHeaders: ['Content-Type', 'Set-Cookie'],
    exposedHeaders: ['Access-Control-Allow-Origin'],
  });
  // TODO: Look into interference with dto validation
  app.useGlobalPipes(new ValidationPipe({ 
    whitelist: true,
    transform: true,
   }));
  await app.listen(3000);
}
bootstrap();
