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
