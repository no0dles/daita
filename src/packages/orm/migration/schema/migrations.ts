export class Migrations {
  static schema = 'daita';
  static table = 'migrations';

  id!: string;
  schema!: string;
  after?: string;
  resolve?: string;
}
