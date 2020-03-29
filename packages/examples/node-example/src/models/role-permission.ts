import {Permission} from './permission';
import {Role} from './role';
import {BaseTable} from './base-table';
import {TablePermission} from '@daita/core';
import {CanManageRoles, CanViewRoles} from '../permissions';

export class RolePermission extends BaseTable {
  permission!: Permission;
  permissionName!: string;
  role!: Role;
  roleName!: string;
}

export const RolePermissionPermissions: TablePermission<RolePermission>[] = [
  {permission: CanViewRoles, select: true, delete: false, insert: false, update: false},
  {permission: CanManageRoles, select: true, delete: true, insert: true, update: true},
];