import { testMigrationStepsTest } from './test-migration-steps.test';
import { table } from '@daita/relational';

describe('orm/migration/update-table-primary-key', () => {
  testMigrationStepsTest({
    base: {
      tables: {
        User: {
          fields: {
            id: { type: 'string', name: 'id', required: true },
            username: { type: 'string', name: 'username', required: true },
          },
          primaryKeys: ['id'],
          name: 'User',
          schema: 'custom',
        },
      },
    },
    target: {
      tables: {
        User: {
          fields: {
            id: { type: 'string', name: 'id', required: true },
            username: { type: 'string', name: 'username', required: true },
          },
          primaryKeys: ['username'],
          name: 'User',
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
