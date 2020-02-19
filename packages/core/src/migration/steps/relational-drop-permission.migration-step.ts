export interface RelationalDropPermissionMigrationStep {
  kind: 'drop_relational_permission';
  table: string;
  identifier: string;
}
