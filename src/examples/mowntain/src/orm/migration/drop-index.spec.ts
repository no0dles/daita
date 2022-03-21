import { testMigrationStepsTest } from './test-migration-steps.test';
import { table } from '@daita/relational';

describe('orm/migration/drop-index', () => {
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
          indices: {
            username: { unique: true, fields: ['username'] },
          },
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
          primaryKeys: ['id'],
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
