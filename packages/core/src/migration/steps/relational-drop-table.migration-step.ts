export interface RelationalDropTableMigrationStep {
  kind: 'drop_table';
  table: string;
}
