import { IsEmail, IsIn, IsString } from 'class-validator';
import { RoleLevel } from '../roles.enum';

export class CreateRoleDto {
  @IsString()
  @IsIn(Object.values(RoleLevel))
  role: string;

  @IsEmail()
  email: string;
}
