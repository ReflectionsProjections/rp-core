import { IsNumber, IsString } from 'class-validator';

export class GenerateLotteryDto {
  @IsNumber()
  numWinners: number;

  @IsString()
  date: Date;
}
