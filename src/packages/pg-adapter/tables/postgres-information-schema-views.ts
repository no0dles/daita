import { PostgresYesNo } from './postgres-yes-no';

export class PostgresInformationSchemaViews {
  static schema = 'information_schema';
  static table = 'views';

  table_catalog!: string;
  table_schema!: string;
  table_name!: string;
  view_definition!: string;
  check_option!: string;
  is_updateable!: PostgresYesNo;
  is_insertable_into!: PostgresYesNo;
  is_trigger_updatable!: PostgresYesNo;
  is_trigger_deletable!: PostgresYesNo;
  is_trigger_insertable_into!: PostgresYesNo;
}
