import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { WalletService } from './wallet.service';
import { Response, Request } from 'express';
import { AuthGuard } from '../auth/auth.guard';

@Controller('wallet')
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  @UseGuards(AuthGuard)
  @Get('/wallet-auth')
  async generatePass(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const attendeeEmail = req['user'].email;
    return await this.walletService.generateEventPass(attendeeEmail);
  }
}
