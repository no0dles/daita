import { MigrationDescription } from '../../orm/migration';

export const FourthMigration: MigrationDescription = {
  id: 'fourth',
  after: 'third',
  steps: [
    {
      kind: 'add_table_field',
      table: 'UserPool',
      fieldName: 'checkPasswordForBreach',
      type: 'boolean',
      required: false,
      defaultValue: null,
    },
  ],
};
