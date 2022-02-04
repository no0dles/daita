export interface RelationalDropIndexMigrationStep {
  kind: 'drop_index';
  table: string;
  schema?: string;
  name: string;
}
