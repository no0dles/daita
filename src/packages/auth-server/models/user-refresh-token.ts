import { User } from './user';
import { UserPool } from './user-pool';

export class UserRefreshToken {
  static table = 'UserRefreshToken';

  token!: string;
  user!: User;
  userUsername!: string;
  userPoolId!: string;
  userPool!: UserPool;
  issuedAt!: Date;
  authorizedAt!: Date;
}
