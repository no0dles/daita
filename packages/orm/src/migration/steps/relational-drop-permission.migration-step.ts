import { TablePermission } from "@daita/core";

export interface RelationalDropPermissionMigrationStep {
  kind: 'drop_table_permission';
  table: string;
  schema?: string;
  permission: TablePermission<any>;
}
