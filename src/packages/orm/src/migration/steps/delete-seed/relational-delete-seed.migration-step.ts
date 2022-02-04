export interface RelationalDeleteSeedMigrationStep {
  kind: 'delete_seed';
  schema?: string;
  table: string;
  keys: any;
}
