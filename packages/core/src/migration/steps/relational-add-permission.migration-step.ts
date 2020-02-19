import {Permission} from '../../permission';

export interface RelationalAddPermissionMigrationStep {
  kind: 'add_relational_permission';
  table: string;
  identifier: string;
  permission: Permission<any>;
}
