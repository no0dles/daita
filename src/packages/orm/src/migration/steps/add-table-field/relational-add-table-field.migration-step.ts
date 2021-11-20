import { SchemaTableFieldTypeDescription } from '../../../schema/schema-table-field-type-description';
import { MigrationStep } from '../../migration-step';

export interface RelationalAddTableFieldMigrationStep {
  kind: 'add_table_field';
  table: string;
  schema?: string;
  fieldName: string;
  type: SchemaTableFieldTypeDescription;
  required: boolean;
  defaultValue?: any;
  size?: number;
}

export const isAddTableFieldStep = (val: MigrationStep): val is RelationalAddTableFieldMigrationStep =>
  val.kind === 'add_table_field';
