import {
  Injectable,
  CanActivate,
  ExecutionContext,
  Inject,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RolesService } from './roles.service';
import { RoleLevel } from './roles.enum';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    @Inject(RolesService) private roleService: RolesService,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<RoleLevel[]>(
      'roles',
      [context.getHandler(), context.getClass()],
    );
    if (!requiredRoles) {
      return false;
    }

    const request = context.switchToHttp().getRequest();
    const roleData = await this.roleService.findOne(request.user.email);
    if (!roleData) return false;

    return requiredRoles.some((requiredRole) =>
      this.validateRoles(requiredRole, roleData.role),
    );
  }

  validateRoles(requiredRole: RoleLevel, role: RoleLevel) {
    if (role == RoleLevel.Admin) return true;
    if (role == RoleLevel.Corporate) return requiredRole == RoleLevel.Corporate;
  }
}
