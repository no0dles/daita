export interface RelationalUpdateSeedMigrationStep {
  kind: 'update_seed';
  schema?: string;
  table: string;
  seed: any;
  keys: any;
}
