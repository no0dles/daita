import { User } from './user';

export class UserToken {
  static table = 'UserToken';
  static schema = 'daita';

  id!: string;
  user!: User;
  userUsername!: string;
  name!: string;
  token!: string;
  expiresAt?: Date;
  createdAt!: Date;
}
