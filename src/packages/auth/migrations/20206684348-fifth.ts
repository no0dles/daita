import { MigrationDescription } from '../../orm/migration/migration-description';

export const FifthMigration: MigrationDescription = {
  id: 'fifth',
  after: 'fourth',
  steps: [
    {
      kind: 'add_table_field',
      table: 'UserPool',
      fieldName: 'allowRegistration',
      type: 'boolean',
      required: false,
      defaultValue: null,
    },
  ],
};
