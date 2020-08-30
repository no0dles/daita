import { User } from './user';

export class Role {
  name!: string;
}

export class UserRole {
  role!: Role;
  roleName!: string;
  user!: User;
  userUsername!: string;
}
