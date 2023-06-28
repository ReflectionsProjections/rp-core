import { IsString, IsMongoId } from "class-validator";

export class RegisterAttendeeDto {
  @IsMongoId()
  id: string;
}

