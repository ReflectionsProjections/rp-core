import { Module } from '@nestjs/common';
import { WalletController } from './wallet.controller';
import { WalletService } from './wallet.service';
import { AttendeeService } from '../attendees/attendees.service';
import { AttendeesModule } from '../attendees/attendees.module';

@Module({
  imports: [AttendeesModule],
  controllers: [WalletController],
  providers: [WalletService],
  exports: [],
})
export class WalletModule {}
