import { IsEmail, IsNumberString, Length } from 'class-validator';

export class VerifyPasscodeDto {
  @IsEmail()
  email: string;

  @IsNumberString()
  @Length(6, 6)
  passcode: string;
}
