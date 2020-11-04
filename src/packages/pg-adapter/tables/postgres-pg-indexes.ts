export class PostgresPgIndexes {
  static table = 'pg_indexes';

  schemaname!: string;
  tablename!: string;
  indexname!: string;
  tablespace!: string | null;
  indexdef!: string;
}
