import { Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  providers: [EmailService],
  controllers: [],
})
export class EmailModule {}
