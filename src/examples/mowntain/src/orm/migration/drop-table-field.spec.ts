import { testMigrationStepsTest } from './test-migration-steps.test';
import { field, table } from '@daita/relational';

describe('orm/migration/drop-table-field', () => {
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
          },
          primaryKeys: ['id'],
          schema: 'custom',
        },
      },
    },
    expectedSteps: [
      {
        kind: 'drop_table_field',
        table: 'User',
        fieldName: 'username',
        schema: 'custom',
      },
    ],
    verifySqls: [
      {
        success: true,
        sql: {
          select: field(table('User', 'custom'), 'id'),
          from: table('User', 'custom'),
        },
      },
      {
        success: false,
        sql: {
          select: field(table('User', 'custom'), 'username'),
          from: table('User', 'custom'),
        },
      },
    ],
  });
});
