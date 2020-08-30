export class User {
  static table = 'user';
  static schema = 'auth';

  id!: string;
  name!: string;
  disabled!: boolean;
  loginCount!: number;
  lastLogin?: Date;
  createdAt!: Date;
  createdFromId?: string;
}
