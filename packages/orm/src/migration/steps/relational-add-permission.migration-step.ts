import {TablePermission} from '../../permission';

export interface RelationalAddPermissionMigrationStep {
  kind: 'add_table_permission';
  table: string;
  schema?: string;
  permission: TablePermission<any>;
}
