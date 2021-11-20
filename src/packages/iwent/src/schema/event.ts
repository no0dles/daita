import { Json } from '@daita/relational';

export class DaitaEvent {
  static table = 'event';
  static schema = 'daita';

  id!: string;
  type!: string;
  payload!: Json;
  createdAt!: Date;
  userId?: string;
  userIssuer?: string;
}
