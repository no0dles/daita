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
    expectedUp: [
      { alterTable: table('User', 'custom'), drop: { constraint: 'parent' } },
      { alterTable: table('User', 'custom'), drop: { constraint: 'User_pkey' } },
      {
        alterTable: table('User', 'custom'),
        drop: { column: 'parentId' },
      },
      {
        alterTable: table('User', 'custom'),
        add: { column: 'parentUsername', type: 'string' },
      },
      {
        alterTable: table('User', 'custom'),
        add: { primaryKey: ['username'] },
      },
      {
        alterTable: table('User', 'custom'),
        add: {
          foreignKey: ['parent'],
          constraint: 'parent',
          references: { table: table('User', 'custom'), primaryKeys: ['username'] },
        },
      },
    ],
    expectedDown: [
      { alterTable: table('User', 'custom'), drop: { constraint: 'parent' } },
      { alterTable: table('User', 'custom'), drop: { constraint: 'User_pkey' } },
      {
        alterTable: table('User', 'custom'),
        drop: { column: 'parentUsername' },
      },
      {
        alterTable: table('User', 'custom'),
        add: { column: 'parentId', type: 'string' },
      },
      {
        alterTable: table('User', 'custom'),
        add: { primaryKey: ['id'] },
      },
      {
        alterTable: table('User', 'custom'),
        add: {
          foreignKey: ['parentId'],
          constraint: 'parent',
          references: { table: table('User', 'custom'), primaryKeys: ['id'] },
        },
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
