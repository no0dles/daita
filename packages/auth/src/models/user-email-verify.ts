import { User } from './user';

export class UserEmailVerify {
  user!: User;
  userUsername!: string;
  email!: string;
  code!: string;
  issuedAt!: Date;
  verifiedAt?: Date;
}
