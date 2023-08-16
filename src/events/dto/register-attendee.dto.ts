import { IsString, IsMongoId, IsEmail } from 'class-validator';

export class RegisterAttendeeDto {
  @IsMongoId()
  id: string;
}

export class RegisterAttendeeEmailDto {
  @IsEmail()
  email: string;
}

export class RegisterAttendeeQRDto {
  token: string;
}
