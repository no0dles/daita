export interface RelationalInsertSeedMigrationStep {
  kind: 'insert_seed';
  schema?: string;
  table: string;
  keys: any;
  seed: any;
}
