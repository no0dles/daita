import { UserPool } from './user-pool';

export class UserPoolCors {
  static table = 'UserPoolCors';

  id!: string;
  userPool!: UserPool;
  userPoolId!: string;
  url!: string;
}
