import { IsEmail, IsNotEmpty } from 'class-validator';

export class GeneratePasscodeDto {
  @IsEmail()
  email: string;
}
