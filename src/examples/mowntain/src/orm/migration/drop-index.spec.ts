import { testMigrationStepsTest } from './test-migration-steps.test';
import { table } from '@daita/relational';

describe('orm/migration/drop-index', () => {
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
          indices: {
            username: { unique: true, name: 'username', fields: ['username'] },
          },
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
          primaryKeys: ['id'],
          name: 'User',
          schema: 'custom',
        },
      },
    },
    expectedSteps: [
      {
        kind: 'drop_index',
        name: 'username',
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
          insert: { id: 'b', username: 'test' },
          into: table('User', 'custom'),
        },
      },
    ],
  });
});
