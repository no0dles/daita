import { UserPool } from './user-pool';

export class Role {
  name!: string;
  description?: string;
  userPoolId!: string;
  userPool!: UserPool;
}
