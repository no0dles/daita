import { testMigrationStepsTest } from './test-migration-steps.test';
import { all, table } from '@daita/relational';

describe('orm/migration/drop-view', () => {
  testMigrationStepsTest({
    base: {
      views: {
        User: {
          schema: 'custom',
          query: {
            select: 1,
          },
        },
      },
    },
    target: {},
    expectedUp: [
      {
        dropView: table('User', 'custom'),
      },
    ],
    expectedDown: [
      {
        createView: table('User', 'custom'),
        as: {
          select: 1,
        },
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
