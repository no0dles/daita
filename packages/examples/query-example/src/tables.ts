
export class User {
  static table = 'user';

  username!: string;
  email?: string;

  parent?: User;
  parentUsername?: string;
}

export class UserRole {
  static table = 'user_role';

  role!: Role;
  roleName!: string;
  user!: User;
  userUsername!: string;
}

export class Role {
  static table = 'role';

  name!: string;
}
