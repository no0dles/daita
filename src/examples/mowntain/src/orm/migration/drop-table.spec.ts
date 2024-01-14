import { testMigrationStepsTest } from './test-migration-steps.test';
import { all, table } from '@daita/relational';

describe('orm/migration/drop-table', () => {
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
    target: {},
    expectedUp: [
      {
        dropTable: table('User', 'custom'),
      },
    ],
    expectedDown: [
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
    verifySqls: [
      {
        success: false,
        sql: {
          select: all(),
          from: table('User', 'custom'),
        },
      },
    ],
  });
});
