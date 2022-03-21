import { testMigrationStepsTest } from './test-migration-steps.test';
import { equal, field, table } from '@daita/relational';

describe('orm/migration/update-table-foreign-key', () => {
  testMigrationStepsTest({
    base: {
      tables: {
        User: {
          fields: {
            id: { type: 'string', required: true },
            username: { type: 'string', required: true },
            parentId: { type: 'string', required: false },
          },
          primaryKeys: ['id'],
          schema: 'custom',
          references: {
            parent: {
              table: 'User',
              schema: 'custom',
              keys: [{ field: 'parentId', foreignField: 'id' }],
              onDelete: 'set null',
              onUpdate: null,
            },
          },
        },
      },
    },
    target: {
      tables: {
        User: {
          fields: {
            id: { type: 'string', required: true },
            username: { type: 'string', required: true },
            parentUsername: { type: 'string', required: false },
          },
          primaryKeys: ['username'],
          schema: 'custom',
          references: {
            parent: {
              table: 'User',
              schema: 'custom',
              keys: [{ field: 'parentUsername', foreignField: 'username' }],
              onDelete: 'set null',
              onUpdate: null,
            },
          },
        },
      },
    },
    expectedSteps: [
      {
        kind: 'drop_table_foreign_key',
        schema: 'custom',
        table: 'User',
        name: 'parent',
      },
      {
        kind: 'drop_table_primary_key',
        schema: 'custom',
        table: 'User',
      },
      {
        fieldName: 'parentId',
        kind: 'drop_table_field',
        schema: 'custom',
        table: 'User',
      },
      {
        fieldName: 'parentUsername',
        kind: 'add_table_field',
        required: false,
        schema: 'custom',
        table: 'User',
        type: 'string',
      },
      {
        fieldNames: ['username'],
        kind: 'add_table_primary_key',
        schema: 'custom',
        table: 'User',
      },
      {
        fieldNames: ['parentUsername'],
        foreignFieldNames: ['username'],
        foreignTable: 'User',
        foreignTableSchema: 'custom',
        kind: 'add_table_foreign_key',
        name: 'parent',
        onDelete: 'set null',
        required: false,
        schema: 'custom',
        table: 'User',
      },
    ],
    verifySqls: [
      {
        success: true,
        sql: {
          insert: { id: 'a', username: 'parent' },
          into: table('User', 'custom'),
        },
      },
      {
        success: true,
        sql: {
          insert: { id: 'b', username: 'child', parentUsername: 'parent' },
          into: table('User', 'custom'),
        },
      },
      {
        success: true,
        sql: {
          delete: table('User', 'custom'),
          where: equal(field(table('User', 'custom'), 'username'), 'parent'),
        },
      },
      {
        success: true,
        sql: {
          select: field(table('User', 'custom'), 'parentUsername'),
          from: table('User', 'custom'),
          where: equal(field(table('User', 'custom'), 'username'), 'child'),
        },
        expectedResult: { rowCount: 1, rows: [{ parentUsername: null }] },
      },
    ],
  });
});
