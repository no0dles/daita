import { testMigrationStepsTest } from './test-migration-steps.test';
import { all, table } from '@daita/relational';

describe('orm/migration/drop-view', () => {
  testMigrationStepsTest({
    base: {
      views: {
        User: {
          name: 'User',
          key: 'User',
          schema: 'custom',
          query: {
            select: 1,
          },
        },
      },
    },
    target: {},
    expectedSteps: [
      {
        kind: 'drop_view',
        schema: 'custom',
        view: 'User',
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
