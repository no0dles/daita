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
    expectedSteps: [
      { kind: 'add_table', table: 'User', schema: 'custom' },
      {
        kind: 'add_table_field',
        table: 'User',
        fieldName: 'id',
        type: 'string',
        required: true,
        defaultValue: undefined,
        schema: 'custom',
      },
      { kind: 'add_table_primary_key', table: 'User', fieldNames: ['id'], schema: 'custom' },
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
