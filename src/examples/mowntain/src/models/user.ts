import { UUID } from '@daita/relational';

export class User {
  static table = 'user';
  static schema = 'auth';

  id!: UUID;
  name!: string;
  disabled!: boolean;
  loginCount!: number;
  lastLogin?: Date;
  createdAt!: Date;
  createdFromId?: string;
}
