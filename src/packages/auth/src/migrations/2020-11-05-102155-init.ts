import { MigrationDescription } from '@daita/orm';

export const InitMigration: MigrationDescription = {
  id: 'init',
  steps: [
    { kind: 'add_table', table: 'User', schema: 'daita' },
    {
      kind: 'add_table_field',
      table: 'User',
      schema: 'daita',
      fieldName: 'disabled',
      type: 'boolean',
      required: true,
      defaultValue: undefined,
    },
    {
      kind: 'add_table_field',
      table: 'User',
      schema: 'daita',
      fieldName: 'email',
      type: 'string',
      required: false,
      defaultValue: undefined,
    },
    {
      kind: 'add_table_field',
      table: 'User',
      schema: 'daita',
      fieldName: 'emailVerified',
      type: 'boolean',
      required: false,
      defaultValue: undefined,
    },
    {
      kind: 'add_table_field',
      table: 'User',
      schema: 'daita',
      fieldName: 'password',
      type: 'string',
      required: true,
      defaultValue: undefined,
    },
    {
      kind: 'add_table_field',
      table: 'User',
      schema: 'daita',
      fieldName: 'phone',
      type: 'string',
      required: false,
      defaultValue: undefined,
    },
    {
      kind: 'add_table_field',
      table: 'User',
      schema: 'daita',
      fieldName: 'phoneVerified',
      type: 'boolean',
      required: false,
      defaultValue: undefined,
    },
    {
      kind: 'add_table_field',
      table: 'User',
      schema: 'daita',
      fieldName: 'schema',
      type: 'string',
      required: true,
      defaultValue: 'daita',
    },
    {
      kind: 'add_table_field',
      table: 'User',
      schema: 'daita',
      fieldName: 'table',
      type: 'string',
      required: true,
      defaultValue: 'User',
    },
    {
      kind: 'add_table_field',
      table: 'User',
      schema: 'daita',
      fieldName: 'userPoolId',
      type: 'string',
      required: true,
      defaultValue: undefined,
    },
    {
      kind: 'add_table_field',
      table: 'User',
      schema: 'daita',
      fieldName: 'username',
      type: 'string',
      required: true,
      defaultValue: undefined,
    },
    { kind: 'add_table_primary_key', table: 'User', schema: 'daita', fieldNames: ['username'] },
    { kind: 'add_table', table: 'UserPool', schema: 'daita' },
    {
      kind: 'add_table_field',
      table: 'UserPool',
      schema: 'daita',
      fieldName: 'accessTokenExpiresIn',
      type: 'number',
      required: true,
      defaultValue: undefined,
    },
    {
      kind: 'add_table_field',
      table: 'UserPool',
      schema: 'daita',
      fieldName: 'algorithm',
      type: 'string',
      required: true,
      defaultValue: undefined,
    },
    {
      kind: 'add_table_field',
      table: 'UserPool',
      schema: 'daita',
      fieldName: 'allowRegistration',
      type: 'boolean',
      required: false,
      defaultValue: undefined,
    },
    {
      kind: 'add_table_field',
      table: 'UserPool',
      schema: 'daita',
      fieldName: 'checkPasswordForBreach',
      type: 'boolean',
      required: false,
      defaultValue: undefined,
    },
    {
      kind: 'add_table_field',
      table: 'UserPool',
      schema: 'daita',
      fieldName: 'emailVerifyExpiresIn',
      type: 'number',
      required: true,
      defaultValue: undefined,
    },
    {
      kind: 'add_table_field',
      table: 'UserPool',
      schema: 'daita',
      fieldName: 'id',
      type: 'string',
      required: true,
      defaultValue: undefined,
    },
    {
      kind: 'add_table_field',
      table: 'UserPool',
      schema: 'daita',
      fieldName: 'name',
      type: 'string',
      required: true,
      defaultValue: undefined,
    },
    {
      kind: 'add_table_field',
      table: 'UserPool',
      schema: 'daita',
      fieldName: 'passwordRegex',
      type: 'string',
      required: false,
      defaultValue: undefined,
    },
    {
      kind: 'add_table_field',
      table: 'UserPool',
      schema: 'daita',
      fieldName: 'refreshRefreshExpiresIn',
      type: 'number',
      required: true,
      defaultValue: undefined,
    },
    {
      kind: 'add_table_field',
      table: 'UserPool',
      schema: 'daita',
      fieldName: 'schema',
      type: 'string',
      required: true,
      defaultValue: 'daita',
    },
    {
      kind: 'add_table_field',
      table: 'UserPool',
      schema: 'daita',
      fieldName: 'table',
      type: 'string',
      required: true,
      defaultValue: 'UserPool',
    },
    { kind: 'add_table_primary_key', table: 'UserPool', schema: 'daita', fieldNames: ['id'] },
    { kind: 'add_table', table: 'Role', schema: 'daita' },
    {
      kind: 'add_table_field',
      table: 'Role',
      schema: 'daita',
      fieldName: 'description',
      type: 'string',
      required: false,
      defaultValue: undefined,
    },
    {
      kind: 'add_table_field',
      table: 'Role',
      schema: 'daita',
      fieldName: 'name',
      type: 'string',
      required: true,
      defaultValue: undefined,
    },
    {
      kind: 'add_table_field',
      table: 'Role',
      schema: 'daita',
      fieldName: 'schema',
      type: 'string',
      required: true,
      defaultValue: 'daita',
    },
    {
      kind: 'add_table_field',
      table: 'Role',
      schema: 'daita',
      fieldName: 'table',
      type: 'string',
      required: true,
      defaultValue: 'Role',
    },
    {
      kind: 'add_table_field',
      table: 'Role',
      schema: 'daita',
      fieldName: 'userPoolId',
      type: 'string',
      required: true,
      defaultValue: undefined,
    },
    { kind: 'add_table_primary_key', table: 'Role', schema: 'daita', fieldNames: ['name', 'userPoolId'] },
    { kind: 'add_table', table: 'UserRole', schema: 'daita' },
    {
      kind: 'add_table_field',
      table: 'UserRole',
      schema: 'daita',
      fieldName: 'roleName',
      type: 'string',
      required: true,
      defaultValue: undefined,
    },
    {
      kind: 'add_table_field',
      table: 'UserRole',
      schema: 'daita',
      fieldName: 'roleUserPoolId',
      type: 'string',
      required: true,
      defaultValue: undefined,
    },
    {
      kind: 'add_table_field',
      table: 'UserRole',
      schema: 'daita',
      fieldName: 'schema',
      type: 'string',
      required: true,
      defaultValue: 'daita',
    },
    {
      kind: 'add_table_field',
      table: 'UserRole',
      schema: 'daita',
      fieldName: 'table',
      type: 'string',
      required: true,
      defaultValue: 'UserRole',
    },
    {
      kind: 'add_table_field',
      table: 'UserRole',
      schema: 'daita',
      fieldName: 'userUsername',
      type: 'string',
      required: true,
      defaultValue: undefined,
    },
    { kind: 'add_table_primary_key', table: 'UserRole', schema: 'daita', fieldNames: ['userUsername', 'roleName'] },
    { kind: 'add_table', table: 'UserReset', schema: 'daita' },
    {
      kind: 'add_table_field',
      table: 'UserReset',
      schema: 'daita',
      fieldName: 'code',
      type: 'string',
      required: true,
      defaultValue: undefined,
    },
    {
      kind: 'add_table_field',
      table: 'UserReset',
      schema: 'daita',
      fieldName: 'issuedAt',
      type: 'boolean',
      required: true,
      defaultValue: undefined,
    },
    {
      kind: 'add_table_field',
      table: 'UserReset',
      schema: 'daita',
      fieldName: 'schema',
      type: 'string',
      required: true,
      defaultValue: 'daita',
    },
    {
      kind: 'add_table_field',
      table: 'UserReset',
      schema: 'daita',
      fieldName: 'table',
      type: 'string',
      required: true,
      defaultValue: 'UserReset',
    },
    {
      kind: 'add_table_field',
      table: 'UserReset',
      schema: 'daita',
      fieldName: 'userUsername',
      type: 'string',
      required: true,
      defaultValue: undefined,
    },
    { kind: 'add_table_primary_key', table: 'UserReset', schema: 'daita', fieldNames: ['code'] },
    { kind: 'add_table', table: 'UserEmailVerify', schema: 'daita' },
    {
      kind: 'add_table_field',
      table: 'UserEmailVerify',
      schema: 'daita',
      fieldName: 'code',
      type: 'string',
      required: true,
      defaultValue: undefined,
    },
    {
      kind: 'add_table_field',
      table: 'UserEmailVerify',
      schema: 'daita',
      fieldName: 'email',
      type: 'string',
      required: true,
      defaultValue: undefined,
    },
    {
      kind: 'add_table_field',
      table: 'UserEmailVerify',
      schema: 'daita',
      fieldName: 'issuedAt',
      type: 'date',
      required: true,
      defaultValue: undefined,
    },
    {
      kind: 'add_table_field',
      table: 'UserEmailVerify',
      schema: 'daita',
      fieldName: 'schema',
      type: 'string',
      required: true,
      defaultValue: 'daita',
    },
    {
      kind: 'add_table_field',
      table: 'UserEmailVerify',
      schema: 'daita',
      fieldName: 'table',
      type: 'string',
      required: true,
      defaultValue: 'UserEmailVerify',
    },
    {
      kind: 'add_table_field',
      table: 'UserEmailVerify',
      schema: 'daita',
      fieldName: 'userUsername',
      type: 'string',
      required: true,
      defaultValue: undefined,
    },
    {
      kind: 'add_table_field',
      table: 'UserEmailVerify',
      schema: 'daita',
      fieldName: 'verifiedAt',
      type: 'date',
      required: false,
      defaultValue: undefined,
    },
    { kind: 'add_table_primary_key', table: 'UserEmailVerify', schema: 'daita', fieldNames: ['code'] },
    { kind: 'add_table', table: 'UserPoolCors', schema: 'daita' },
    {
      kind: 'add_table_field',
      table: 'UserPoolCors',
      schema: 'daita',
      fieldName: 'id',
      type: 'string',
      required: true,
      defaultValue: undefined,
    },
    {
      kind: 'add_table_field',
      table: 'UserPoolCors',
      schema: 'daita',
      fieldName: 'schema',
      type: 'string',
      required: true,
      defaultValue: 'daita',
    },
    {
      kind: 'add_table_field',
      table: 'UserPoolCors',
      schema: 'daita',
      fieldName: 'table',
      type: 'string',
      required: true,
      defaultValue: 'UserPoolCors',
    },
    {
      kind: 'add_table_field',
      table: 'UserPoolCors',
      schema: 'daita',
      fieldName: 'url',
      type: 'string',
      required: true,
      defaultValue: undefined,
    },
    {
      kind: 'add_table_field',
      table: 'UserPoolCors',
      schema: 'daita',
      fieldName: 'userPoolId',
      type: 'string',
      required: true,
      defaultValue: undefined,
    },
    { kind: 'add_table_primary_key', table: 'UserPoolCors', schema: 'daita', fieldNames: ['id'] },
    { kind: 'add_table', table: 'UserRefreshToken', schema: 'daita' },
    {
      kind: 'add_table_field',
      table: 'UserRefreshToken',
      schema: 'daita',
      fieldName: 'authorizedAt',
      type: 'date',
      required: true,
      defaultValue: undefined,
    },
    {
      kind: 'add_table_field',
      table: 'UserRefreshToken',
      schema: 'daita',
      fieldName: 'issuedAt',
      type: 'date',
      required: true,
      defaultValue: undefined,
    },
    {
      kind: 'add_table_field',
      table: 'UserRefreshToken',
      schema: 'daita',
      fieldName: 'schema',
      type: 'string',
      required: true,
      defaultValue: 'daita',
    },
    {
      kind: 'add_table_field',
      table: 'UserRefreshToken',
      schema: 'daita',
      fieldName: 'table',
      type: 'string',
      required: true,
      defaultValue: 'UserRefreshToken',
    },
    {
      kind: 'add_table_field',
      table: 'UserRefreshToken',
      schema: 'daita',
      fieldName: 'token',
      type: 'string',
      required: true,
      defaultValue: undefined,
    },
    {
      kind: 'add_table_field',
      table: 'UserRefreshToken',
      schema: 'daita',
      fieldName: 'userPoolId',
      type: 'string',
      required: true,
      defaultValue: undefined,
    },
    {
      kind: 'add_table_field',
      table: 'UserRefreshToken',
      schema: 'daita',
      fieldName: 'userUsername',
      type: 'string',
      required: true,
      defaultValue: undefined,
    },
    { kind: 'add_table_primary_key', table: 'UserRefreshToken', schema: 'daita', fieldNames: ['token'] },
    { kind: 'add_table', table: 'UserToken', schema: 'daita' },
    {
      kind: 'add_table_field',
      table: 'UserToken',
      schema: 'daita',
      fieldName: 'createdAt',
      type: 'date',
      required: true,
      defaultValue: undefined,
    },
    {
      kind: 'add_table_field',
      table: 'UserToken',
      schema: 'daita',
      fieldName: 'expiresAt',
      type: 'date',
      required: false,
      defaultValue: undefined,
    },
    {
      kind: 'add_table_field',
      table: 'UserToken',
      schema: 'daita',
      fieldName: 'id',
      type: 'string',
      required: true,
      defaultValue: undefined,
    },
    {
      kind: 'add_table_field',
      table: 'UserToken',
      schema: 'daita',
      fieldName: 'name',
      type: 'string',
      required: true,
      defaultValue: undefined,
    },
    {
      kind: 'add_table_field',
      table: 'UserToken',
      schema: 'daita',
      fieldName: 'schema',
      type: 'string',
      required: true,
      defaultValue: 'daita',
    },
    {
      kind: 'add_table_field',
      table: 'UserToken',
      schema: 'daita',
      fieldName: 'table',
      type: 'string',
      required: true,
      defaultValue: 'UserToken',
    },
    {
      kind: 'add_table_field',
      table: 'UserToken',
      schema: 'daita',
      fieldName: 'token',
      type: 'string',
      required: true,
      defaultValue: undefined,
    },
    {
      kind: 'add_table_field',
      table: 'UserToken',
      schema: 'daita',
      fieldName: 'userUsername',
      type: 'string',
      required: true,
      defaultValue: undefined,
    },
    { kind: 'add_table_primary_key', table: 'UserToken', schema: 'daita', fieldNames: ['token'] },
    { kind: 'add_table', table: 'UserPoolUser', schema: 'daita' },
    {
      kind: 'add_table_field',
      table: 'UserPoolUser',
      schema: 'daita',
      fieldName: 'schema',
      type: 'string',
      required: true,
      defaultValue: 'daita',
    },
    {
      kind: 'add_table_field',
      table: 'UserPoolUser',
      schema: 'daita',
      fieldName: 'table',
      type: 'string',
      required: true,
      defaultValue: 'UserPoolUser',
    },
    {
      kind: 'add_table_field',
      table: 'UserPoolUser',
      schema: 'daita',
      fieldName: 'userPoolId',
      type: 'string',
      required: true,
      defaultValue: undefined,
    },
    {
      kind: 'add_table_field',
      table: 'UserPoolUser',
      schema: 'daita',
      fieldName: 'userUsername',
      type: 'string',
      required: true,
      defaultValue: undefined,
    },
    {
      kind: 'add_table_primary_key',
      table: 'UserPoolUser',
      schema: 'daita',
      fieldNames: ['userPoolId', 'userUsername'],
    },
    {
      kind: 'add_table_foreign_key',
      table: 'User',
      schema: 'daita',
      name: 'userPool',
      fieldNames: ['userPoolId'],
      foreignFieldNames: ['id'],
      foreignTable: 'UserPool',
      foreignTableSchema: 'daita',
      required: true,
    },
    {
      kind: 'add_table_foreign_key',
      table: 'Role',
      schema: 'daita',
      name: 'userPool',
      fieldNames: ['userPoolId'],
      foreignFieldNames: ['id'],
      foreignTable: 'UserPool',
      foreignTableSchema: 'daita',
      required: true,
    },
    {
      kind: 'add_table_foreign_key',
      table: 'UserRole',
      schema: 'daita',
      name: 'user',
      fieldNames: ['userUsername'],
      foreignFieldNames: ['username'],
      foreignTable: 'User',
      foreignTableSchema: 'daita',
      required: true,
    },
    {
      kind: 'add_table_foreign_key',
      table: 'UserRole',
      schema: 'daita',
      name: 'role',
      fieldNames: ['roleName', 'roleUserPoolId'],
      foreignFieldNames: ['name', 'userPoolId'],
      foreignTable: 'Role',
      foreignTableSchema: 'daita',
      required: true,
    },
    {
      kind: 'add_table_foreign_key',
      table: 'UserReset',
      schema: 'daita',
      name: 'user',
      fieldNames: ['userUsername'],
      foreignFieldNames: ['username'],
      foreignTable: 'User',
      foreignTableSchema: 'daita',
      required: true,
    },
    {
      kind: 'add_table_foreign_key',
      table: 'UserEmailVerify',
      schema: 'daita',
      name: 'user',
      fieldNames: ['userUsername'],
      foreignFieldNames: ['username'],
      foreignTable: 'User',
      foreignTableSchema: 'daita',
      required: true,
    },
    {
      kind: 'add_table_foreign_key',
      table: 'UserPoolCors',
      schema: 'daita',
      name: 'userPool',
      fieldNames: ['userPoolId'],
      foreignFieldNames: ['id'],
      foreignTable: 'UserPool',
      foreignTableSchema: 'daita',
      required: true,
    },
    {
      kind: 'add_table_foreign_key',
      table: 'UserRefreshToken',
      schema: 'daita',
      name: 'user',
      fieldNames: ['userUsername'],
      foreignFieldNames: ['username'],
      foreignTable: 'User',
      foreignTableSchema: 'daita',
      required: true,
    },
    {
      kind: 'add_table_foreign_key',
      table: 'UserRefreshToken',
      schema: 'daita',
      name: 'userPool',
      fieldNames: ['userPoolId'],
      foreignFieldNames: ['id'],
      foreignTable: 'UserPool',
      foreignTableSchema: 'daita',
      required: true,
    },
    {
      kind: 'add_table_foreign_key',
      table: 'UserToken',
      schema: 'daita',
      name: 'user',
      fieldNames: ['userUsername'],
      foreignFieldNames: ['username'],
      foreignTable: 'User',
      foreignTableSchema: 'daita',
      required: true,
    },
    {
      kind: 'add_table_foreign_key',
      table: 'UserPoolUser',
      schema: 'daita',
      name: 'user',
      fieldNames: ['userUsername'],
      foreignFieldNames: ['username'],
      foreignTable: 'User',
      foreignTableSchema: 'daita',
      required: true,
    },
    {
      kind: 'add_table_foreign_key',
      table: 'UserPoolUser',
      schema: 'daita',
      name: 'userPool',
      fieldNames: ['userPoolId'],
      foreignFieldNames: ['id'],
      foreignTable: 'UserPool',
      foreignTableSchema: 'daita',
      required: true,
    },
  ],
};
