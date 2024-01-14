export class PostgresInformationSchemaKeyColumnUsage {
  static schema = 'information_schema';
  static table = 'key_column_usage';

  constrait_catalog!: string;
  constraint_schema!: string;
  constraint_name!: string;
  table_catalog!: string;
  table_schema!: string;
  table_name!: string;
  column_name!: string;
  ordinal_position!: number;
  position_in_unique_constraint!: number | null;
}
