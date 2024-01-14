import { User } from './user';

export class UserEmailVerify {
  static table = 'UserEmailVerify';
  static schema = 'daita';

  user!: User;
  userUsername!: string;
  email!: string;
  code!: string;
  issuedAt!: Date;
  verifiedAt?: Date;
}
