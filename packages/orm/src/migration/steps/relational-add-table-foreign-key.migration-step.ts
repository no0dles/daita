export interface RelationalAddTableForeignKey {
  kind: 'add_table_foreign_key';
  table: string;
  schema?: string;
  name: string;
  fieldNames: string[];
  foreignTable: string;
  foreignTableSchema?: string;
  foreignFieldNames: string[];
  required: boolean;
}
