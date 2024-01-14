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
    expectedUp: [
      {
        createView: table('Test', 'custom'),
        as: {
          select: "'hello'",
        },
      },
    ],
    expectedDown: [
      {
        dropView: table('Test', 'custom'),
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
