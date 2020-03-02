import {PostgresAdapter} from './postgres.adapter';
import {MigrationDescription, MigrationExecution} from '@daita/core';
import {getMigrationSchema} from '@daita/core/dist/schema/migration-schema-builder';

function testMigrations(
  migrationBefore: MigrationDescription[],
  migration: MigrationDescription,
  expectedSqls: string[],
) {
  const exec = new MigrationExecution();
  const migrationSchema = getMigrationSchema(migrationBefore);
  const sql = exec.plan(
    migration,
    migrationSchema,
    new PostgresAdapter('postgres://localhost'),
  );
  expect(sql).toEqual(expectedSqls);
}

describe('migration', () => {
  describe('plan', () => {
    it('should create table with varchar field', () => {
      const migration: MigrationDescription = {
        id: 'test',
        steps: [
          {kind: 'add_table', table: 'foo'},
          {kind: 'add_table_field', table: 'foo', fieldName: 'bar', type: 'string', required: true},
        ],
      };
      testMigrations([], migration, [
        'CREATE TABLE "foo_test" ("bar_test" varchar);',
      ]);
    });

    it('should alter table with new integer column', () => {
      const migrationBefore: MigrationDescription[] = [
        {
          id: 'test',
          steps: [
            {kind: 'add_table', table: 'foo'},
            {kind: 'add_table_field', table: 'foo', fieldName: 'bar', type: 'string', required: true},
          ],
        },
      ];
      const migration: MigrationDescription = {
        id: 'test2',
        steps: [
          {kind: 'add_table_field', table: 'foo', fieldName: 'foo', type: 'number', required: false},
        ],
      };
      testMigrations(migrationBefore, migration, [
        'ALTER TABLE "foo_test" ADD COLUMN "foo_test2" integer;',
      ]);
    });

    it('should drop table', () => {
      const migrationBefore: MigrationDescription[] = [
        {
          id: 'test',
          steps: [
            {kind: 'add_table', table: 'foo'},
            {kind: 'add_table_field', table: 'foo', fieldName: 'bar', type: 'string', required: true},
          ],
        },
      ];
      const migration: MigrationDescription = {
        id: 'test2',
        steps: [
          {kind: 'drop_table', table: 'foo'},
        ],
      };
      testMigrations(migrationBefore, migration, ['DROP TABLE "foo_test";']);
    });
  });
});