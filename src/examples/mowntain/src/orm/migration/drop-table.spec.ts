import { testMigrationStepsTest } from './test-migration-steps.test';
import { all, table } from '@daita/relational';

describe('orm/migration/drop-table', () => {
  testMigrationStepsTest({
    base: {
      tables: {
        User: {
          fields: {
            id: { type: 'string', name: 'id', required: true },
          },
          primaryKeys: ['id'],
          name: 'User',
          schema: 'custom',
        },
      },
    },
    target: {},
    expectedSteps: [{ kind: 'drop_table', table: 'User', schema: 'custom' }],
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
