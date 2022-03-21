import { testMigrationStepsTest } from './test-migration-steps.test';
import { table } from '@daita/relational';

describe('orm/migration/add-table-field', () => {
  testMigrationStepsTest({
    base: {
      tables: {
        User: {
          fields: {
            id: { type: 'string', required: true },
          },
          primaryKeys: ['id'],
          schema: 'custom',
        },
      },
    },
    target: {
      tables: {
        User: {
          fields: {
            id: { type: 'string', required: true },
            username: { type: 'string', required: true },
            lastLogin: { type: 'date', required: false },
            enabled: { type: 'boolean', required: true, defaultValue: true },
          },
          primaryKeys: ['id'],
          schema: 'custom',
        },
      },
    },
    expectedSteps: [
      {
        kind: 'add_table_field',
        table: 'User',
        fieldName: 'username',
        type: 'string',
        required: true,
        defaultValue: undefined,
        schema: 'custom',
      },
      {
        kind: 'add_table_field',
        table: 'User',
        fieldName: 'lastLogin',
        type: 'date',
        required: false,
        defaultValue: undefined,
        schema: 'custom',
      },
      {
        kind: 'add_table_field',
        table: 'User',
        fieldName: 'enabled',
        type: 'boolean',
        required: true,
        defaultValue: true,
        schema: 'custom',
      },
    ],
    verifySqls: [
      {
        success: true,
        sql: {
          into: table('User', 'custom'),
          insert: {
            id: 'a',
            username: 'test',
            lastLogin: new Date(),
            enabled: true,
          },
        },
      },
    ],
  });
});
