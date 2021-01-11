import { MigrationDescription } from '../../../packages/orm';

export const InitialMigration: MigrationDescription = {
  id: 'initial',
  steps: [
    { kind: 'add_table', table: 'Todo' },
    {
      kind: 'add_table_field',
      table: 'Todo',
      fieldName: 'completed',
      type: 'boolean',
      required: true,
      defaultValue: undefined,
    },
    {
      kind: 'add_table_field',
      table: 'Todo',
      fieldName: 'createdAt',
      type: 'date',
      required: true,
      defaultValue: undefined,
    },
    {
      kind: 'add_table_field',
      table: 'Todo',
      fieldName: 'id',
      type: 'string',
      required: true,
      defaultValue: undefined,
    },
    {
      kind: 'add_table_field',
      table: 'Todo',
      fieldName: 'name',
      type: 'string',
      required: true,
      defaultValue: undefined,
    },
    { kind: 'add_table_primary_key', table: 'Todo', fieldNames: ['id'] },
  ],
};
