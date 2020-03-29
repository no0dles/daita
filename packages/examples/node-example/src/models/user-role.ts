import {Role} from './role';
import {User} from './user';
import {BaseTable} from './base-table';
import {TablePermission} from '@daita/core';
import {CanManageUsers, CanViewUsers} from '../permissions';

export class UserRole extends BaseTable {
  user!: User;
  userUsername!: string;
  role!: Role;
  roleName!: string;
}

export const UserRolePermissions: TablePermission<UserRole>[] = [
  {permission: CanViewUsers, select: true, delete: false, insert: false, update: false},
  {permission: CanManageUsers, select: true, delete: true, insert: true, update: true},
];