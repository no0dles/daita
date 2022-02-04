export class PostgresInformationSchemaTables {
  static schema = 'information_schema';
  static table = 'tables';

  table_catalog!: string;
  table_schema!: string;
  table_name!: string;
  table_type!: string;
}
