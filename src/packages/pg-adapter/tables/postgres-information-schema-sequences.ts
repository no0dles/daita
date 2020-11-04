import { PostgresYesNo } from './postgres-yes-no';

export class PostgresInformationSchemaSequences {
  static schema = 'information_schema';
  static table = 'sequences';

  sequence_catalog!: string;
  sequence_schema!: string;
  sequence_name!: string;
  data_type!: string;
  numeric_precision!: number;
  numeric_precision_radix!: number;
  numeric_scale!: number;
  start_value!: number;
  minimum_value!: number;
  increment!: number;
  cycle_option!: PostgresYesNo;
}
