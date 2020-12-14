import { UserPool } from './user-pool';

export class User {
  static table = 'User';

  username!: string;
  email?: string;
  emailVerified?: boolean;
  phone?: string;
  phoneVerified?: boolean;
  password!: string;
  disabled!: boolean;
  userPool!: UserPool;
  userPoolId!: string;
}
