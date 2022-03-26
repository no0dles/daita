import { testMigrationStepsTest } from './test-migration-steps.test';
import { field, table } from '@daita/relational';

describe('orm/migration/drop-table-field', () => {
  testMigrationStepsTest({
    base: {
      tables: {
        User: {
          fields: {
            id: { type: 'string', name: 'id', required: true },
            username: { type: 'string', name: 'username', required: true },
          },
          primaryKeys: ['id'],
          name: 'User',
          schema: 'custom',
        },
      },
    },
    target: {
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
