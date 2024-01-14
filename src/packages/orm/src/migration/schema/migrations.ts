import { Json } from '@daita/relational';

export class Migrations {
  static schema = 'daita';
  static table = 'migrations';

  id!: string;
  schema!: string;
  after?: string;
  resolve?: string;
  upMigration!: Json<any[]>;
  downMigration!: Json<any[]>;
}
