import { testMigrationStepsTest } from './test-migration-steps.test';
import { table } from '@daita/relational';

describe('orm/migration/create-index', () => {
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
          primaryKeys: ['id'],
          schema: 'custom',
          indices: {
            username: { unique: true, fields: ['username'] },
          },
        },
      },
    },
    expectedSteps: [
      {
        fields: ['username'],
        kind: 'create_index',
        name: 'username',
        schema: 'custom',
        table: 'User',
        unique: true,
      },
    ],
    verifySqls: [
      {
        success: true,
        sql: {
          into: table('User', 'custom'),
          insert: { id: 'a', username: 'test' },
        },
      },
      {
        success: false,
        sql: {
          into: table('User', 'custom'),
          insert: { id: 'a', username: 'test' },
        },
      },
    ],
  });
});
