import { Json } from '@daita/relational';

export class DaitaEvent {
  static table = 'event';
  static schema = 'daita';

  id!: string;
  type!: string;
  payload!: Json<any>;
  createdAt!: Date;
  userId?: string;
  userIssuer?: string;
}
