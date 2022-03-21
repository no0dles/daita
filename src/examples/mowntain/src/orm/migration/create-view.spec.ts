import { testMigrationStepsTest } from './test-migration-steps.test';
import { all, table } from '@daita/relational';

describe('orm/migration/create-view', () => {
  testMigrationStepsTest({
    base: {},
    target: {
      views: {
        Test: {
          schema: 'custom',
          query: {
            select: "'hello'",
          },
        },
      },
    },
    expectedSteps: [
      {
        kind: 'add_view',
        query: {
          select: "'hello'",
        },
        schema: 'custom',
        view: 'Test',
      },
    ],
    verifySqls: [
      {
        success: true,
        sql: {
          select: all(),
          from: table('Test', 'custom'),
        },
      },
    ],
  });
});
