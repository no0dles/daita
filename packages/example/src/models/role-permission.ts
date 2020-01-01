import {Permission} from './permission';
import {Role} from './role';

export class RolePermission {
  permission!: Permission;
  permissionName!: string;
  role!: Role;
  roleName!: string;
}
