import { SetMetadata } from '@nestjs/common';
import { RoleLevel } from "./role.enum";

export const Roles = (...roles: RoleLevel[]) => SetMetadata('roles', roles);

