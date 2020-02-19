export interface RelationalDropTableFieldMigrationStep {
  kind: 'drop_table_field';
  table: string;
  fieldName: string;
}
