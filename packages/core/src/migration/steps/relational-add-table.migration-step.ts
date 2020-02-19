export interface RelationalAddTableMigrationStep {
  kind: 'add_table';
  table: string;
}
