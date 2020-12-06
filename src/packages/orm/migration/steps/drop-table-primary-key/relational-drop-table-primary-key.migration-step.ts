export interface RelationalDropTablePrimaryKeyMigrationStep {
  kind: 'drop_table_primary_key';
  table: string;
  schema?: string;
}
