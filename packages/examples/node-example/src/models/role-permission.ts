import {Permission} from './permission';
import {Role} from './role';
import {BaseTable} from './base-table';

export class RolePermission extends BaseTable {
  permission!: Permission;
  permissionName!: string;
  role!: Role;
  roleName!: string;
}
