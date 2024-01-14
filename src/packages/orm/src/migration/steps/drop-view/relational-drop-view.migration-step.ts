export interface RelationalDropViewMigrationStep {
  kind: 'drop_view';
  schema?: string;
  view: string;
}
