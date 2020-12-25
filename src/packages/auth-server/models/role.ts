import { UserPool } from './user-pool';

export class Role {
  static table = 'Role';
  static schema = 'daita';

  name!: string;
  description?: string;
  userPoolId!: string;
  userPool!: UserPool;
}
