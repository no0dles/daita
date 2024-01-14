import { PostgresYesNo } from './postgres-yes-no';

export class PostgresInformationSchemaTableConstraints {
  static schema = 'information_schema';
  static table = 'table_constraints';

  constraint_catalog!: string;
  constraint_schema!: string;
  constraint_name!: string;
  table_catalog!: string;
  table_schema!: string;
  table_name!: string;
  constraint_type!: 'CHECK' | 'FOREIGN KEY' | 'PRIMARY KEY' | 'UNIQUE';
  is_deferrable!: PostgresYesNo;
  initially_deferred!: PostgresYesNo;
  enforced!: PostgresYesNo;
}
