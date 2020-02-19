import {RelationalTableSchemaTableFieldType} from '../../schema';

export interface RelationalAddTableFieldMigrationStep {
  kind: 'add_table_field';
  table: string;
  fieldName: string;
  type: RelationalTableSchemaTableFieldType;
  required: boolean;
  defaultValue?: any;
}
