import { testMigrationStepsTest } from './test-migration-steps.test';
import { table } from '@daita/relational';

describe('orm/migration/update-index', () => {
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
            username: { unique: false, fields: ['username'] },
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
          indices: {
            username: { unique: true, fields: ['username'] },
          },
        },
      },
    },
    expectedUp: [
      {
        dropIndex: 'username',
        on: table('User', 'custom'),
      },
      {
        createIndex: 'username',
        columns: ['username'],
        unique: true,
        on: table('User', 'custom'),
      },
    ],
    expectedDown: [
      {
        dropIndex: 'username',
        on: table('User', 'custom'),
      },
      {
        createIndex: 'username',
        columns: ['username'],
        on: table('User', 'custom'),
      },
    ],
    verifySqls: [
      {
        success: true,
        sql: {
          insert: {
            id: 'a',
            username: 'test',
          },
          into: table('User', 'custom'),
        },
      },
      {
        success: false,
        sql: {
          insert: {
            id: 'b',
            username: 'test',
          },
          into: table('User', 'custom'),
        },
      },
    ],
  });
});
