import {Permission} from '../../permission';

export interface RelationalDropPermissionMigrationStep {
  kind: 'drop_table_permission';
  table: string;
  permission: Permission<any>;
}
