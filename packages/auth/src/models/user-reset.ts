import { User } from './user';

export class UserReset {
  user!: User;
  userUsername!: string;
  code!: string;
  issuedAt!: boolean;
}
