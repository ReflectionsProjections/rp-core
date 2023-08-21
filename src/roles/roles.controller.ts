import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { Roles } from './roles.decorator';
import { RoleLevel } from './roles.enum';
import { AuthGuard } from '../auth/auth.guard';
import { RolesGuard } from './roles.guard';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { MongoIdPipe } from '../mongo-id/mongo-id.pipe';

@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(RoleLevel.Admin)
  @Get()
  getRoleList() {
    return this.rolesService.findAll();
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(RoleLevel.Admin)
  @Post()
  addRole(@Body() dto: CreateRoleDto) {
    return this.rolesService.createNew(dto);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(RoleLevel.Admin)
  @Delete(':roleId')
  revokeRole(@Param('roleId', MongoIdPipe) roleId: string) {
    return this.rolesService.deleteRole(roleId);
  }
}
