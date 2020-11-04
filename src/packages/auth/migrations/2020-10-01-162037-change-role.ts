import { MigrationDescription } from '../../orm/migration/migration-description';

export const ChangeRoleMigration: MigrationDescription = {
  id: 'change-role',
  after: 'user-pool-role',
  steps: [
    { kind: 'add_table', table: 'Role' },
    {
      kind: 'add_table_field',
      table: 'Role',
      fieldName: 'name',
      type: 'string',
      required: true,
      defaultValue: undefined,
    },
    {
      kind: 'add_table_field',
      table: 'Role',
      fieldName: 'description',
      type: 'string',
      required: false,
      defaultValue: undefined,
    },
    {
      kind: 'add_table_field',
      table: 'Role',
      fieldName: 'userPoolId',
      type: 'string',
      required: true,
      defaultValue: undefined,
    },
    { kind: 'add_table_primary_key', table: 'Role', fieldNames: ['name', 'userPoolId'] },
    {
      kind: 'add_table_field',
      fieldName: 'roleUserPoolId',
      type: 'string',
      required: true,
      defaultValue: undefined,
      table: 'UserRole',
    },
    {
      kind: 'add_table_field',
      fieldName: 'roleUserpoolid',
      type: 'string',
      required: true,
      defaultValue: undefined,
      table: 'UserRole',
    },
    {
      kind: 'add_table_foreign_key',
      table: 'UserRole',
      name: 'role',
      fieldNames: ['roleName', 'roleUserpoolid'],
      foreignFieldNames: ['name', 'userPoolId'],
      foreignTable: 'Role',
      required: true,
    },
    { kind: 'drop_table', table: 'UserPoolRole' },
    {
      kind: 'add_table_foreign_key',
      table: 'Role',
      name: 'userPool',
      fieldNames: ['userPoolId'],
      foreignFieldNames: ['id'],
      foreignTable: 'UserPool',
      required: true,
    },
  ],
};
