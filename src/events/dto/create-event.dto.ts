import {
  IsBoolean,
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateEventDto {
  @IsNotEmpty()
  name: string;

  @IsDateString()
  end_time: Date;

  @IsNotEmpty()
  description: string;

  @IsDateString()
  start_time: Date;

  @IsNotEmpty()
  location: string;

  @IsBoolean()
  virtual: boolean;

  @IsBoolean()
  upgrade: boolean;

  @IsBoolean()
  downgrade: boolean;

  @IsOptional()
  @IsString()
  imageUrl: string;

  @IsBoolean()
  visible: boolean;
}
