import {Role} from './role';
import {User} from './user';
import {BaseTable} from './base-table';

export class UserRole extends BaseTable {
  user!: User;
  userUsername!: string;
  role!: Role;
  roleName!: string;
}
