import { Module } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { AttendeeService } from '../attendees/attendees.service';
import { AttendeesModule } from '../attendees/attendees.module';

@Module({
  imports: [AttendeesModule],
  providers: [WalletService],
  exports: [],
})
export class WalletModule {}
