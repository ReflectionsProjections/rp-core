import { Module } from '@nestjs/common';
import { WalletController } from './wallet.controller';
import { WalletService } from './wallet.service';
import { AttendeeService } from 'src/attendees/attendees.service';
import { AttendeesModule } from 'src/attendees/attendees.module';

@Module({
  imports: [AttendeesModule],
  controllers: [WalletController],
  providers: [WalletService],
  exports: [],
})
export class WalletModule {}
