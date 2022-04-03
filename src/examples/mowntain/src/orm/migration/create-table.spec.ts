import { testMigrationStepsTest } from './test-migration-steps.test';
import { table } from '@daita/relational';

describe('orm/migration/create-table', () => {
  testMigrationStepsTest({
    base: {},
    target: {
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
    expectedUp: [
      {
        createTable: table('User', 'schema'),
        columns: [
          {
            name: 'id',
            type: 'string',
            notNull: true,
            primaryKey: true,
          },
        ],
      },
    ],
    expectedDown: [
      {
        dropTable: table('User', 'schema'),
      },
    ],
    verifySqls: [
      {
        success: true,
        sql: {
          into: table('User', 'custom'),
          insert: { id: 'a' },
        },
      },
      {
        success: false,
        sql: {
          into: table('User', 'custom'),
          insert: { id: 'a' },
        },
      },
    ],
  });
});
