import {RelationalTableSchemaTableField} from './relational-table-schema-table-field';
import {RelationalTableSchemaTableReferenceKey} from "./relational-table-schema-table-reference-key";

export interface RelationalTableSchemaTable {
  name: string;
  fieldNames: string[];
  field(name: string): RelationalTableSchemaTableField | null;
  fields: RelationalTableSchemaTableField[];
  primaryKeys: string[];
  foreignKeys: RelationalTableSchemaTableReferenceKey[];
}

