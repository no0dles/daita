import { RelationalTableSchemaTableFieldType } from '../../../schema/relational-table-schema-table-field-type';
import { MigrationStep } from '../../migration-step';

export interface RelationalAddTableFieldMigrationStep {
  kind: 'add_table_field';
  table: string;
  schema?: string;
  fieldName: string;
  type: RelationalTableSchemaTableFieldType;
  required: boolean;
  defaultValue?: any;
}

export const isAddTableFieldStep = (val: MigrationStep): val is RelationalAddTableFieldMigrationStep =>
  val.kind === 'add_table_field';
