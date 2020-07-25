import { User } from './user';

export class UserRefreshToken {
  token!: string;
  user!: User;
  userUsername!: string;
  issuedAt!: Date;
  authorizedAt!: Date;
}
