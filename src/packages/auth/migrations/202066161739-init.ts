import { MigrationDescription } from '../../orm/migration/migration-description';

export const InitMigration: MigrationDescription = {
  id: 'init',
  steps: [
    { kind: 'add_table', table: 'User' },
    {
      kind: 'add_table_field',
      table: 'User',
      fieldName: 'username',
      type: 'string',
      required: true,
      defaultValue: null,
    },
    {
      kind: 'add_table_field',
      table: 'User',
      fieldName: 'email',
      type: 'string',
      required: false,
      defaultValue: null,
    },
    {
      kind: 'add_table_field',
      table: 'User',
      fieldName: 'emailVerified',
      type: 'boolean',
      required: false,
      defaultValue: null,
    },
    {
      kind: 'add_table_field',
      table: 'User',
      fieldName: 'phone',
      type: 'string',
      required: false,
      defaultValue: null,
    },
    {
      kind: 'add_table_field',
      table: 'User',
      fieldName: 'phoneVerified',
      type: 'boolean',
      required: false,
      defaultValue: null,
    },
    {
      kind: 'add_table_field',
      table: 'User',
      fieldName: 'password',
      type: 'string',
      required: true,
      defaultValue: null,
    },
    {
      kind: 'add_table_field',
      table: 'User',
      fieldName: 'disabled',
      type: 'boolean',
      required: true,
      defaultValue: null,
    },
    {
      kind: 'add_table_field',
      table: 'User',
      fieldName: 'userPoolId',
      type: 'string',
      required: true,
      defaultValue: null,
    },
    { kind: 'add_table_primary_key', table: 'User', fieldNames: ['username'] },
    { kind: 'add_table', table: 'UserPool' },
    {
      kind: 'add_table_field',
      table: 'UserPool',
      fieldName: 'id',
      type: 'string',
      required: true,
      defaultValue: null,
    },
    {
      kind: 'add_table_field',
      table: 'UserPool',
      fieldName: 'name',
      type: 'string',
      required: true,
      defaultValue: null,
    },
    {
      kind: 'add_table_field',
      table: 'UserPool',
      fieldName: 'algorithm',
      type: 'string',
      required: true,
      defaultValue: null,
    },
    {
      kind: 'add_table_field',
      table: 'UserPool',
      fieldName: 'passwordRegex',
      type: 'string',
      required: false,
      defaultValue: null,
    },
    {
      kind: 'add_table_field',
      table: 'UserPool',
      fieldName: 'accessTokenExpiresIn',
      type: 'number',
      required: true,
      defaultValue: null,
    },
    {
      kind: 'add_table_field',
      table: 'UserPool',
      fieldName: 'refreshRefreshExpiresIn',
      type: 'number',
      required: true,
      defaultValue: null,
    },
    { kind: 'add_table_primary_key', table: 'UserPool', fieldNames: ['id'] },
    { kind: 'add_table', table: 'Role' },
    {
      kind: 'add_table_field',
      table: 'Role',
      fieldName: 'name',
      type: 'string',
      required: true,
      defaultValue: null,
    },
    {
      kind: 'add_table_field',
      table: 'Role',
      fieldName: 'description',
      type: 'string',
      required: false,
      defaultValue: null,
    },
    { kind: 'add_table_primary_key', table: 'Role', fieldNames: ['name'] },
    { kind: 'add_table', table: 'UserReset' },
    {
      kind: 'add_table_field',
      table: 'UserReset',
      fieldName: 'userUsername',
      type: 'string',
      required: true,
      defaultValue: null,
    },
    {
      kind: 'add_table_field',
      table: 'UserReset',
      fieldName: 'code',
      type: 'string',
      required: true,
      defaultValue: null,
    },
    {
      kind: 'add_table_field',
      table: 'UserReset',
      fieldName: 'issuedAt',
      type: 'boolean',
      required: true,
      defaultValue: null,
    },
    { kind: 'add_table_primary_key', table: 'UserReset', fieldNames: ['code'] },
    { kind: 'add_table', table: 'UserEmailVerify' },
    {
      kind: 'add_table_field',
      table: 'UserEmailVerify',
      fieldName: 'userUsername',
      type: 'string',
      required: true,
      defaultValue: null,
    },
    {
      kind: 'add_table_field',
      table: 'UserEmailVerify',
      fieldName: 'email',
      type: 'string',
      required: true,
      defaultValue: null,
    },
    {
      kind: 'add_table_field',
      table: 'UserEmailVerify',
      fieldName: 'code',
      type: 'string',
      required: true,
      defaultValue: null,
    },
    {
      kind: 'add_table_field',
      table: 'UserEmailVerify',
      fieldName: 'issuedAt',
      type: 'date',
      required: true,
      defaultValue: null,
    },
    {
      kind: 'add_table_primary_key',
      table: 'UserEmailVerify',
      fieldNames: ['code'],
    },
    { kind: 'add_table', table: 'UserPoolCors' },
    {
      kind: 'add_table_field',
      table: 'UserPoolCors',
      fieldName: 'id',
      type: 'string',
      required: true,
      defaultValue: null,
    },
    {
      kind: 'add_table_field',
      table: 'UserPoolCors',
      fieldName: 'userPoolId',
      type: 'string',
      required: true,
      defaultValue: null,
    },
    {
      kind: 'add_table_field',
      table: 'UserPoolCors',
      fieldName: 'url',
      type: 'string',
      required: true,
      defaultValue: null,
    },
    {
      kind: 'add_table_primary_key',
      table: 'UserPoolCors',
      fieldNames: ['id'],
    },
    { kind: 'add_table', table: 'UserRefreshToken' },
    {
      kind: 'add_table_field',
      table: 'UserRefreshToken',
      fieldName: 'token',
      type: 'string',
      required: true,
      defaultValue: null,
    },
    {
      kind: 'add_table_field',
      table: 'UserRefreshToken',
      fieldName: 'userUsername',
      type: 'string',
      required: true,
      defaultValue: null,
    },
    {
      kind: 'add_table_field',
      table: 'UserRefreshToken',
      fieldName: 'issuedAt',
      type: 'date',
      required: true,
      defaultValue: null,
    },
    {
      kind: 'add_table_field',
      table: 'UserRefreshToken',
      fieldName: 'authorizedAt',
      type: 'date',
      required: true,
      defaultValue: null,
    },
    {
      kind: 'add_table_primary_key',
      table: 'UserRefreshToken',
      fieldNames: ['token'],
    },
    {
      kind: 'add_table_foreign_key',
      table: 'User',
      name: 'userPool',
      foreignTable: 'UserPool',
      fieldNames: ['userPoolId'],
      foreignFieldNames: ['id'],
      required: true,
    },
    {
      kind: 'add_table_foreign_key',
      table: 'UserReset',
      name: 'user',
      foreignTable: 'User',
      fieldNames: ['userUsername'],
      foreignFieldNames: ['username'],
      required: true,
    },
    {
      kind: 'add_table_foreign_key',
      table: 'UserEmailVerify',
      name: 'user',
      foreignTable: 'User',
      fieldNames: ['userUsername'],
      foreignFieldNames: ['username'],
      required: true,
    },
    {
      kind: 'add_table_foreign_key',
      table: 'UserPoolCors',
      name: 'userPool',
      foreignTable: 'UserPool',
      fieldNames: ['userPoolId'],
      foreignFieldNames: ['id'],
      required: true,
    },
    {
      kind: 'add_table_foreign_key',
      table: 'UserRefreshToken',
      name: 'user',
      foreignTable: 'User',
      fieldNames: ['userUsername'],
      foreignFieldNames: ['username'],
      required: true,
    },
  ],
};
