export interface RelationalAddTableForeignKey {
  kind: 'add_table_foreign_key';
  table: string;
  name: string;
  fieldNames: string[];
  foreignTable: string;
  foreignFieldNames: string[];
  required: boolean;
}
