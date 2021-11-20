import { PostgresYesNo } from './postgres-yes-no';

export class PostgresInformationSchemaColumns {
  static schema = 'information_schema';
  static table = 'columns';

  table_catalog!: string;
  table_schema!: string;
  table_name!: string;
  column_name!: string;
  ordinal_position!: number;
  column_default!: string;
  is_nullable!: PostgresYesNo;
  data_type!: string;
  character_maximum_length!: number | null;
  character_octet_length!: number | null;
  numeric_precision!: number | null;
}
