import { testFormat } from './test/formatter.test';

describe('insert-formatter', () => {
  testFormat({
    query: {
      insert: 'foo',
      values:  [{ bar: 1, foo: 2 }],
    },
    expectedFormat: 'INSERT INTO "foo" ("bar", "foo") VALUES ($1, $2)',
    expectedValues:  [1, 2],
  });

  testFormat({
    query: {
      insert: 'foo',
      values:  { bar: 1, foo: 2 },
    },
    expectedFormat: 'INSERT INTO "foo" ("bar", "foo") VALUES ($1, $2)',
    expectedValues:  [1, 2],
  });

  testFormat({
    query: {
      insert: 'foo',
      values:  [
        { bar: 1, foo: 2 },
        { bar: 1, foo: 1 },
      ],
    },
    expectedFormat: 'INSERT INTO "foo" ("bar", "foo") VALUES ($1, $2), ($1, $1)',
    expectedValues:  [1, 2],
  });

  testFormat({
    query: {
      insert: 'foo',
      values:  {
        select: [{ field: 'bar' }, { field: 'bar' }],
        from: 'bar',
      },
    },
    expectedFormat: 'INSERT INTO "foo" SELECT "bar", "bar" FROM "bar"',
    expectedValues:  [],
  });
});
