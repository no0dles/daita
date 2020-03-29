import {Permission} from './permission';
import {User} from './user';
import {BaseTable} from './base-table';
import {TablePermission} from '@daita/core';
import {CanManageUsers, CanViewUsers} from '../permissions';

export class UserPermission extends BaseTable {
  permission!: Permission;
  permissionName!: string;
  user!: User;
  userUsername!: string;
}

export const UserPermissionPermissions: TablePermission<User>[] = [
  {permission: CanViewUsers, select: true, delete: false, insert: false, update: false},
  {permission: CanManageUsers, select: true, delete: true, insert: true, update: true},
];