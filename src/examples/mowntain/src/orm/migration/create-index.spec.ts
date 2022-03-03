import { testMigrationStepsTest } from './test-migration-steps.test';
import { table } from '@daita/relational';

describe('orm/migration/create-index', () => {
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
          primaryKeys: ['id'],
          name: 'User',
          schema: 'custom',
          indices: {
            username: { unique: true, name: 'username', fields: ['username'] },
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
