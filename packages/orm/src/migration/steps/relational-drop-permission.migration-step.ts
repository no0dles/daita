import { TablePermission } from "@daita/relational";

export interface RelationalDropPermissionMigrationStep {
  kind: 'drop_table_permission';
  table: string;
  schema?: string;
  permission: TablePermission<any>;
}
