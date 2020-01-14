import {Permission} from './permission';
import {User} from './user';
import {BaseTable} from './base-table';

export class UserPermission extends BaseTable {
  permission!: Permission;
  permissionName!: string;
  user!: User;
  userUsername!: string;
}
