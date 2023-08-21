import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Role, RoleDocument } from './role.schema';
import { CreateRoleDto } from './dto/create-role.dto';

@Injectable()
export class RolesService {
  constructor(@InjectModel(Role.name) private roleModel: Model<RoleDocument>) {}

  findOne(email: string) {
    return this.roleModel.findOne({ email });
  }

  findAll() {
    return this.roleModel.find();
  }

  async createNew(body: CreateRoleDto) {
    return await this.roleModel.create(body);
  }

  async deleteRole(id: string) {
    return await this.roleModel.findByIdAndDelete(id);
  }
}
