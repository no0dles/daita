import { UserPool } from './user-pool';

export class Role {
  static table = 'Role';

  name!: string;
  description?: string;
  userPoolId!: string;
  userPool!: UserPool;
}
