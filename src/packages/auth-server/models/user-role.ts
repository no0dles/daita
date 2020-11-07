import { User } from './user';
import { Role } from './role';

export class UserRole {
  user!: User;
  userUsername!: string;
  role!: Role;
  roleName!: string;
  roleUserPoolId!: string;
}
