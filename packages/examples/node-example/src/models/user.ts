import {TablePermission} from '@daita/core';
import {CanManageUsers, CanViewUsers} from '../permissions';

export class User {
  username!: string;
  firstName!: string | null;
  lastName!: string | null;
  password!: string;
  email!: string;
}

export const UserPermissions: TablePermission<User>[] = [
  {permission: CanViewUsers, select: true, delete: false, insert: false, update: false},
  {permission: CanManageUsers, select: true, delete: true, insert: true, update: true},
];