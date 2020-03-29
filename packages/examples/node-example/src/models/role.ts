import {BaseTable} from './base-table';
import {TablePermission} from '@daita/core';
import {CanManageRoles, CanViewRoles} from '../permissions';

export class Role extends BaseTable {
  name!: string;
}

export const RolePermissions: TablePermission<Role>[] = [
  {permission: CanViewRoles, select: true, delete: false, insert: false, update: false},
  {permission: CanManageRoles, select: true, delete: true, insert: true, update: true},
];