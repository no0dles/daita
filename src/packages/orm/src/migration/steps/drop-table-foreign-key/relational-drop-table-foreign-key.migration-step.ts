export interface RelationalDropTableForeignKeyMigrationStep {
  kind: 'drop_table_foreign_key';
  table: string;
  schema?: string;
  name: string;
}
