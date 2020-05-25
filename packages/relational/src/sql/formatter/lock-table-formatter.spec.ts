import { testFormat } from './test/formatter.test';

describe('lock-table-formatter', () => {
  testFormat({
    expectedFormat: 'LOCK TABLE "foo"',
    query: {
      lockTable: 'foo',
    },
  });

  testFormat({
    expectedFormat: 'LOCK TABLE "public"."foo"',
    query: {
      lockTable: { schema: 'public', table: 'foo' },
    },
  });
});
