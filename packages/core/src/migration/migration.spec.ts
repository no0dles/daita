import {PostgresDataAdapter} from '../postgres';
import {getMigrationSchema} from '../schema/migration-schema-builder';
import {RelationalAddTableMigrationStep} from './steps/relation-add-table.migration-step';
import {RelationalAddTableFieldMigrationStep} from './steps/relational-add-table-field.migration-step';
import {expect} from 'chai';
import {RelationalDropTableMigrationStep} from './steps/relational-drop-table.migration-step';
import {MigrationDescription} from "./migration-description";
import {MigrationExecution} from "./migration-execution";

function testMigrations(
  migrationBefore: MigrationDescription[],
  migration: MigrationDescription,
  expectedSqls: string[],
) {
  const exec = new MigrationExecution();
  const migrationSchema = getMigrationSchema(migrationBefore);
  const sql = exec.plan(migration,
    migrationSchema,
    new PostgresDataAdapter('postgres://localhost'),
  );
  expect(sql).be.deep.equal(expectedSqls);
}

describe('migration', () => {
  describe('plan', () => {

    it('should create table with varchar field', () => {
      const migration = {
        id: 'test', steps: [
          new RelationalAddTableMigrationStep('foo'),
          new RelationalAddTableFieldMigrationStep('foo', 'bar', 'string', true),
        ]
      };
      testMigrations([], migration, [
        'CREATE TABLE "test_foo" ("test_bar" varchar);',
      ]);
    });

    it('should alter table with new integer column', () => {
      const migrationBefore: MigrationDescription[] = [
        {
          id: 'test', steps: [
            new RelationalAddTableMigrationStep('foo'),
            new RelationalAddTableFieldMigrationStep(
              'foo',
              'bar',
              'string',
              true,
            ),
          ]
        },
      ];
      const migration: MigrationDescription = {
        id: 'test2', steps: [
          new RelationalAddTableFieldMigrationStep('foo', 'foo', 'number', false),
        ]
      };
      testMigrations(migrationBefore, migration, [
        'ALTER TABLE "test_foo" ADD COLUMN "test2_foo" integer;',
      ]);
    });

    it('should drop table', () => {
      const migrationBefore: MigrationDescription[] = [
        {
          id: 'test', steps: [
            new RelationalAddTableMigrationStep('foo'),
            new RelationalAddTableFieldMigrationStep(
              'foo',
              'bar',
              'string',
              true,
            ),
          ]
        },
      ];
      const migration: MigrationDescription = {
        id: 'test2', steps: [
          new RelationalDropTableMigrationStep('foo'),
        ]
      };
      testMigrations(migrationBefore, migration, [
        'DROP TABLE "test_foo";',
      ]);
    });

  });
});
