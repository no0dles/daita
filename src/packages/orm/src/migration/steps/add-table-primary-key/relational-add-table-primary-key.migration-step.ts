export interface RelationalAddTablePrimaryKey {
  kind: 'add_table_primary_key';
  table: string;
  schema?: string;
  fieldNames: string[];
}
