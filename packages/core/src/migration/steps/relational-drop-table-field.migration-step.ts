export interface RelationalDropTableFieldMigrationStep {
  kind: 'drop_table_field';
  table: string;
  schema?: string;
  fieldName: string;
}
