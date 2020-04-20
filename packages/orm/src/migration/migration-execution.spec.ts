import {MigrationExecution} from './migration-execution';
import {MigrationDescription} from './migration-description';
import { SqlDmlQuery } from "@daita/relational";
import { getSchemaDescription } from "../schema/relational-schema-description";
import { SchemaMapper } from "../schema/description/schema-mapper";
import { BackwardCompatibleMapper } from "../schema/description/backward-compatible-mapper";

function testMigrations(
  migrationBefore: MigrationDescription[],
  migration: MigrationDescription,
  expectedSqls: SqlDmlQuery[],
) {
  const exec = new MigrationExecution();
  const current = getSchemaDescription(new SchemaMapper(() => new BackwardCompatibleMapper()), migrationBefore);
  const target = getSchemaDescription(new SchemaMapper(() => new BackwardCompatibleMapper()), [...migrationBefore, migration]);
  const sql = exec.plan(current, target);
  expect(sql).toEqual(expectedSqls);
}

describe('migration-execution', () => {
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
        {createTable: 'foo_test', fields: [{name: 'bar_test', type: 'string', primaryKey: false}]},
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
        {alterTable: 'foo_test', add: {column: 'foo_test2', type: 'number'}},
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
      testMigrations(migrationBefore, migration, [
        {dropTable: 'foo_test'},
      ]);
    });
  });
});
