import { testFormat } from './test/formatter.test';

describe('update-formatter', () => {
  testFormat({
    query: {
      update: 'foo',
      set: {
        bar: 1,
      },
    },
    expectedFormat: 'UPDATE "foo" SET "bar" = $1',
    expectedValues:  [1],
  });

  testFormat({
    query: {
      update: { schema: 'public', table: 'foo' },
      set: {
        bar: 1,
      },
      where: {
        left: { field: 'foo' },
        operand: '=',
        right: 1,
      },
    },
    expectedFormat: 'UPDATE "public"."foo" SET "bar" = $1 WHERE "foo" = $1',
    expectedValues:  [1],
  });


  testFormat({
    query: {
      update: 'foo',
      set: {
        bar: {select: [1]},
      },
    },
    expectedFormat: 'UPDATE "foo" SET "bar" = (SELECT $1)',
    expectedValues:  [1],
  });

  testFormat({
    query: {
      update: 'foo',
      set: {
        bar: {field: 'foo'},
      },
    },
    expectedFormat: 'UPDATE "foo" SET "bar" = "foo"',
    expectedValues:  [],
  });
});
