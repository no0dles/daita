import { RelationalTableSchemaTableFieldType } from './relational-table-schema-table-field-type';

export interface RelationalTableSchemaTableField {
  name: string;
  type: RelationalTableSchemaTableFieldType;
  required: boolean;
  defaultValue: any;
}
