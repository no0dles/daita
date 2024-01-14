import { User } from './user';
import { Role } from './role';

export class UserRole {
  static table = 'UserRole';
  static schema = 'daita';

  user!: User;
  userUsername!: string;
  role!: Role;
  roleName!: string;
  roleUserPoolId!: string;
}
