export interface RelationalCreateIndexMigrationStep {
  kind: 'create_index';
  table: string;
  schema?: string;
  unique?: boolean;
  name: string;
  fields: string[];
}
