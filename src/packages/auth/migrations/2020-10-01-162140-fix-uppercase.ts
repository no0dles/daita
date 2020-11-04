import { MigrationDescription } from '../../orm/migration/migration-description';

export const FixUppercaseMigration: MigrationDescription = {
  id: 'fix-uppercase',
  after: 'change-role',
  steps: [{ kind: 'drop_table_field', table: 'UserRole', fieldName: 'roleUserpoolid' }],
};
