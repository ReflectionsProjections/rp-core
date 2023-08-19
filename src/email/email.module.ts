import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { EmailService } from './email.service';

@Module({
  imports: [HttpModule],
  providers: [EmailService],
  controllers: [],
  exports: [EmailService],
})
export class EmailModule {}
