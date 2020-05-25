import { testFormat } from './test/formatter.test';

describe('alter-table-formatter', () => {
  testFormat({
    query: {
      alterTable: 'foo',
      add: {
        type: 'text',
        column: 'bar',
      },
    },
    expectedFormat: 'ALTER TABLE "foo" ADD COLUMN "bar" text',
    expectedValues: [],
  });

  testFormat({
    query: {
      alterTable: { table: 'foo', schema: 'public' },
      add: {
        column: 'foo',
        type: 'NUMERIC',
      },
    },
    expectedFormat: 'ALTER TABLE "public"."foo" ADD COLUMN "foo" NUMERIC',
  });

  testFormat({
    query: {
      alterTable: 'foo',
      add: {
        column: 'foo',
        type: 'NUMERIC',
      },
    },
    expectedFormat: 'ALTER TABLE "foo" ADD COLUMN "foo" NUMERIC',
  });

  testFormat({
    query: {
      alterTable: { table: 'foo', schema: 'public' },
      drop: {
        column: 'foo',
      },
    },
    expectedFormat: 'ALTER TABLE "public"."foo" DROP COLUMN "foo"',
  });

  testFormat({
    query: {
      alterTable: { table: 'foo', schema: 'public' },
      add: {
        references: { table: 'bar', primaryKeys: 'id' },
        foreignKey: 'barId',
      },
    },
    expectedFormat:
      'ALTER TABLE "public"."foo" ADD FOREIGN KEY ("barId") REFERENCES "bar" ("id")',
  });

  testFormat({
    query: {
      alterTable: { table: 'foo', schema: 'public' },
      add: {
        references: { table: 'bar', primaryKeys: ['id'] },
        foreignKey: ['barId'],
        constraint: 'fk_bar',
      },
    },
    expectedFormat:
      'ALTER TABLE "public"."foo" ADD CONSTRAINT "fk_bar" FOREIGN KEY ("barId") REFERENCES "bar" ("id")',
  });

  testFormat({
    query: {
      alterTable: { table: 'foo', schema: 'public' },
      drop: {
        constraint: 'fk_bar',
      },
    },
    expectedFormat: 'ALTER TABLE "public"."foo" DROP CONSTRAINT "fk_bar"',
  });
});
