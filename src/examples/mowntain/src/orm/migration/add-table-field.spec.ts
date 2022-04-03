import { testMigrationStepsTest } from './test-migration-steps.test';
import { table } from '@daita/relational';

describe('orm/migration/add-table-field', () => {
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
    target: {
      tables: {
        User: {
          fields: {
            id: { type: 'string', required: true },
            username: { type: 'string', required: true },
            lastLogin: { type: 'date', required: false },
            enabled: { type: 'boolean', required: true, defaultValue: true },
          },
          primaryKeys: ['id'],
          schema: 'custom',
        },
      },
    },
    expectedUp: [
      {
        alterTable: table('User', 'custom'),
        add: {
          column: 'username',
          type: 'string',
          notNull: true,
        },
      },
      {
        alterTable: table('User', 'custom'),
        add: {
          column: 'lastLogin',
          type: 'date',
        },
      },
      {
        alterTable: table('User', 'custom'),
        add: {
          column: 'enabled',
          type: 'boolean',
          defaultValue: true,
          notNull: true,
        },
      },
    ],
    expectedDown: [
      {
        alterTable: table('User', 'custom'),
        drop: { column: 'enabled' },
      },
      {
        alterTable: table('User', 'custom'),
        drop: { column: 'lastLogin' },
      },
      {
        alterTable: table('User', 'custom'),
        drop: { column: 'username' },
      },
    ],
    verifySqls: [
      {
        success: true,
        sql: {
          into: table('User', 'custom'),
          insert: {
            id: 'a',
            username: 'test',
            lastLogin: new Date(),
            enabled: true,
          },
        },
      },
    ],
  });
});
