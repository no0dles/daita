import { User } from './user';

export class UserReset {
  static table = 'UserReset';

  user!: User;
  userUsername!: string;
  code!: string;
  issuedAt!: boolean;
}
