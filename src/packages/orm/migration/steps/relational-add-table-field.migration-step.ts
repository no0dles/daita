import { RelationalTableSchemaTableFieldType } from '../../schema/relational-table-schema-table-field-type';

export interface RelationalAddTableFieldMigrationStep {
  kind: 'add_table_field';
  table: string;
  schema?: string;
  fieldName: string;
  type: RelationalTableSchemaTableFieldType;
  required: boolean;
  defaultValue?: any;
}
