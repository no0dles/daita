import { UserPool } from './user-pool';

export class UserPoolCors {
  static table = 'UserPoolCors';
  static schema = 'daita';

  id!: string;
  userPool!: UserPool;
  userPoolId!: string;
  url!: string;
}
