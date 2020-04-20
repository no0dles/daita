import { RelationalTableSchemaTableFieldType } from "../schema/relational-table-schema-table-field-type";

export interface TableField {
  type: RelationalTableSchemaTableFieldType;
  required: boolean;
  defaultValue: any;
}

export interface Table {
  tableName: string;
  fields: { [key: string]: TableField };
  primaryKeys: string[];
  foreignKeys: { table: string; keys: string[]; foreignKeys: string[] }[];
}
