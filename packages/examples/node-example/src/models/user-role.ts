import {Role} from './role';
import {User} from './user';

export class UserRole {
  user!: User;
  userUsername!: string;
  role!: Role;
  roleName!: string;
}
