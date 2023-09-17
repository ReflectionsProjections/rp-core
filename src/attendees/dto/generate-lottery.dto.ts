import { IsDateString, IsNumber } from 'class-validator';

export class GenerateLotteryDto {
  @IsNumber()
  numWinners: number;

  @IsDateString()
  date: Date;
}

