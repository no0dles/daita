import { testFormat } from './test/formatter.test';

describe('drop-table-formatter', () => {
  testFormat({
    query: {
      dropTable: 'foo',
    },
    expectedFormat: 'DROP TABLE "foo"',
    expectedValues: [],
  });

  testFormat({
    query: {
      dropTable: { table: 'foo', schema: 'public' },
      ifExist: true,
    },
    expectedFormat: 'DROP TABLE IF EXISTS "public"."foo"',
    expectedValues: [],
  });

  testFormat({
    query: {
      dropTable: { table: 'foo', schema: 'public' },
    },
    expectedFormat: 'DROP TABLE "public"."foo"',
    expectedValues: [],
  });
});
