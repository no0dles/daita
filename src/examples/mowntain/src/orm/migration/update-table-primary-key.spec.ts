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
    expectedUp: [
      { alterTable: table('User', 'custom'), drop: { constraint: 'User_pkey' } },
      {
        alterTable: table('User', 'custom'),
        add: { primaryKey: ['username'] },
      },
    ],
    expectedDown: [
      { alterTable: table('User', 'custom'), drop: { constraint: 'User_pkey' } },
      {
        alterTable: table('User', 'custom'),
        add: { primaryKey: ['id'] },
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
