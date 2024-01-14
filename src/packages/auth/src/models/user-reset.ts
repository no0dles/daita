import { User } from './user';

export class UserReset {
  static table = 'UserReset';
  static schema = 'daita';

  user!: User;
  userUsername!: string;
  code!: string;
  issuedAt!: boolean;
}
