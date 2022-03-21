import { testMigrationStepsTest } from './test-migration-steps.test';
import { table } from '@daita/relational';

describe('orm/migration/update-table-primary-key', () => {
  testMigrationStepsTest({
    base: {
      tables: {
        User: {
          fields: {
            id: { type: 'string', required: true },
            username: { type: 'string', required: true },
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
          },
          primaryKeys: ['username'],
          schema: 'custom',
        },
      },
    },
    expectedSteps: [
      {
        kind: 'drop_table_primary_key',
        schema: 'custom',
        table: 'User',
      },
      {
        fieldNames: ['username'],
        kind: 'add_table_primary_key',
        schema: 'custom',
        table: 'User',
      },
    ],
    verifySqls: [
      {
        success: true,
        sql: {
          insert: { id: 'a', username: 'test' },
          into: table('User', 'custom'),
        },
      },
      {
        success: true,
        sql: {
          insert: { id: 'a', username: 'foo' },
          into: table('User', 'custom'),
        },
      },
      {
        success: false,
        sql: {
          insert: { id: 'b', username: 'test' },
          into: table('User', 'custom'),
        },
      },
    ],
  });
});
