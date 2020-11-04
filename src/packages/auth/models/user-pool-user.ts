import { User } from './user';
import { UserPool } from './user-pool';

export class UserPoolUser {
  userUsername!: string;
  user!: User;
  userPool!: UserPool;
  userPoolId!: string;
}
