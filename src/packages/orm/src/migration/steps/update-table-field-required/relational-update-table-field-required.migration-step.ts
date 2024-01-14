export interface RelationalUpdateTableFieldRequiredMigrationStep {
  kind: 'update_table_field_required';
  table: string;
  schema?: string;
  name: string;
  required: boolean;
}
