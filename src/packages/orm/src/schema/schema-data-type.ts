import { SchemaTableFieldTypeDescription } from './schema-table-field-type-description';

export interface SchemaDataType {
  type: SchemaTableFieldTypeDescription;
  size?: string;
}
