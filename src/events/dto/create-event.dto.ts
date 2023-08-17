import { IsBoolean, IsDateString, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateEventDto {
  @IsNotEmpty()
  name: string;

  @IsDateString()
  end_time: Date;

  @IsNotEmpty()
  description: string;

  @IsDateString()
  start_time: Date;

  @IsNumber()
  duration: number;

  @IsNotEmpty()
  location: string;

  @IsBoolean()
  virtual: boolean;

  @IsBoolean()
  upgrade: boolean;

  @IsBoolean()
  visible: boolean;
}
