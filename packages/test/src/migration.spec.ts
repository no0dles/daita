import { expect } from 'chai';
import {
  MigrationDescription,
  MigrationExecution,
  RelationalAddTableFieldMigrationStep,
  RelationalAddTableMigrationStep,
  RelationalDropTableMigrationStep,
} from '@daita/core';
import { PostgresDataAdapter } from '@daita/core/dist/postgres';
import { getMigrationSchema } from '@daita/core/dist/schema/migration-schema-builder';

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
    new PostgresDataAdapter('postgres://localhost'),
  );
  expect(sql).be.deep.equal(expectedSqls);
}

describe('migration', () => {
  describe('plan', () => {
    it('should create table with varchar field', () => {
      const migration = {
        id: 'test',
        steps: [
          new RelationalAddTableMigrationStep('foo'),
          new RelationalAddTableFieldMigrationStep(
            'foo',
            'bar',
            'string',
            true,
          ),
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
            new RelationalAddTableMigrationStep('foo'),
            new RelationalAddTableFieldMigrationStep(
              'foo',
              'bar',
              'string',
              true,
            ),
          ],
        },
      ];
      const migration: MigrationDescription = {
        id: 'test2',
        steps: [
          new RelationalAddTableFieldMigrationStep(
            'foo',
            'foo',
            'number',
            false,
          ),
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
            new RelationalAddTableMigrationStep('foo'),
            new RelationalAddTableFieldMigrationStep(
              'foo',
              'bar',
              'string',
              true,
            ),
          ],
        },
      ];
      const migration: MigrationDescription = {
        id: 'test2',
        steps: [new RelationalDropTableMigrationStep('foo')],
      };
      testMigrations(migrationBefore, migration, ['DROP TABLE "foo_test";']);
    });
  });
});
