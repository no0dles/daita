import { expectedSql } from '../../../../../testing/relational/formatter.test';
import { table } from '../../keyword/table/table';

describe('alter-table', () => {
  it('should drop column', () => {
    expectedSql(
      {
        alterTable: table('user'),
        drop: {
          column: 'id',
        },
      },
      'ALTER TABLE "user" DROP COLUMN "id"',
    );
  });

  it('should add column', () => {
    expectedSql(
      {
        alterTable: table('user'),
        add: {
          column: 'id',
          type: 'VARCHAR',
        },
      },
      'ALTER TABLE "user" ADD COLUMN "id" VARCHAR',
    );
  });

  it('should add foreign key', () => {
    expectedSql(
      {
        alterTable: table('user'),
        add: {
          foreignKey: 'createdFromId',
          references: {
            table: table('user'),
            primaryKeys: 'id',
          },
        },
      },
      'ALTER TABLE "user" ADD FOREIGN KEY ("createdFromId") REFERENCES "user" ("id")',
    );
  });

  it('should add foreign key with multiple keys', () => {
    expectedSql(
      {
        alterTable: table('user'),
        add: {
          foreignKey: ['createdFromId', 'secondId'],
          references: {
            table: table('user'),
            primaryKeys: ['id', 'secondId'],
          },
        },
      },
      'ALTER TABLE "user" ADD FOREIGN KEY ("createdFromId", "secondId") REFERENCES "user" ("id", "secondId")',
    );
  });

  it('should add foreign key with constraint name', () => {
    expectedSql(
      {
        alterTable: table('user'),
        add: {
          foreignKey: 'createdFromId',
          constraint: 'createdFrom',
          references: {
            table: table('user'),
            primaryKeys: 'id',
          },
        },
      },
      'ALTER TABLE "user" ADD CONSTRAINT "createdFrom" FOREIGN KEY ("createdFromId") REFERENCES "user" ("id")',
    );
  });

  it('should drop constraint', () => {
    expectedSql(
      {
        alterTable: table('user'),
        drop: {
          constraint: 'foo',
        },
      },
      'ALTER TABLE "user" DROP CONSTRAINT "foo"',
    );
  });
});
