import {BaseTable} from './base-table';
import {TablePermission} from '@daita/core';
import {CanManagePermissions, CanViewPermissions} from '../permissions';

export class Permission extends BaseTable {
  name!: string;
}

export const PermissionPermissions: TablePermission<Permission>[] = [
  {permission: CanViewPermissions, select: true, delete: false, insert: false, update: false},
  {permission: CanManagePermissions, select: true, delete: true, insert: true, update: true},
];