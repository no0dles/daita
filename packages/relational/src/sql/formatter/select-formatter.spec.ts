import { testFormat } from './test/formatter.test';

describe('select-formatter', () => {
  testFormat({
    query: {select: [{ all: true }],},
    expectedFormat: 'SELECT *',
    expectedValues: [],
  });

  testFormat({
    query: {
      select: [{ all: true, table: 'foo' }],
      from: {
        table: 'foo',
      },
    },
    expectedFormat: 'SELECT "foo".* FROM "foo"',
    expectedValues: [],
  });

  testFormat({
    query: {
      select: [{ table: 'f', alias: 'test', field: 'foo' }],
      from: {
        schema: 'public',
        table: 'foo',
        alias: 'f',
      },
      where: {
        and: [
          {
            left: { table: 'f', field: 'foo' },
            right: { table: 'f', field: 'bar' },
            operand: '=',
          },
        ],
      },
    },
    expectedFormat: 'SELECT "f"."foo" AS "test" FROM "public"."foo" AS "f" WHERE "f"."foo" = "f"."bar"',
    expectedValues: [],
  });

  testFormat({
    query: {
      select: [{ table: 'f', alias: 'test', field: 'foo' }],
      from: {
        schema: 'public',
        table: 'foo',
        alias: 'f',
      },
      where: {
        and: [
          {
            left: 'foo',
            right: {
              select: ['foo'],
              from: { schema: 'public', table: 'foo', alias: 'foo' },
            },
            operand: '<=',
          },
        ],
      },
    },
    expectedFormat: 'SELECT "f"."foo" AS "test" FROM "public"."foo" AS "f" WHERE $1 <= (SELECT $1 FROM "public"."foo" AS "foo")',
    expectedValues: ['foo'],
  });

  testFormat({
    query: {
      select: [{ field: 'foo' }],
      from: {
        table: 'foo',
      },
      where: {
        left: { field: 'foo' },
        operand: 'like',
        right: 'foo',
      },
    },
    expectedFormat: 'SELECT "foo" FROM "foo" WHERE "foo" LIKE $1',
    expectedValues: ['foo'],
  });

  testFormat({
    query: {
      select: [{ count: { all: true } }, { field: 'foo' }],
      from: {
        table: 'foo',
      },
      groupBy: [2],
    },
    expectedFormat: 'SELECT count(*), "foo" FROM "foo" GROUP BY $1',
    expectedValues:  [2],
  });

  testFormat({
    query: {
      select: [{ field: 'foo' }],
      from: {
        table: 'foo',
      },
      limit: 10,
      offset: 20,
    },
    expectedFormat: 'SELECT "foo" FROM "foo" LIMIT $1 OFFSET $2',
    expectedValues:  [10, 20],
  });

  testFormat({
    query: {
      select: [{ select: [{ field: 'bar' }], from: 'bar' }],
      from: {
        table: 'foo',
      },
    },
    expectedFormat: 'SELECT (SELECT "bar" FROM "bar") FROM "foo"',
    expectedValues:  [],
  });

  testFormat({
    query: {
      select: [{ select: [{ field: 'bar' }], from: 'bar', alias: 'f' }],
      from: {
        table: 'foo',
      },
    },
    expectedFormat: 'SELECT (SELECT "bar" FROM "bar") AS "f" FROM "foo"',
    expectedValues:  [],
  });

  testFormat({
    query: {
      select: [{ table: 'f', field: 'foo' }],
      from: {
        select: ['foo'],
        alias: 'f',
      },
    },
    expectedFormat: 'SELECT "f"."foo" FROM (SELECT $1) AS "f"',
    expectedValues:  ['foo'],
  });

  testFormat({
    query: {
      select: [{ all: true }],
      from: {
        select: ['foo'],
      },
    },
    expectedFormat: 'SELECT * FROM (SELECT $1)',
    expectedValues:  ['foo'],
  });

  testFormat({
    query: {
      select: [{ count: { distinct: true, field: 'foo' } }],
      from: 'bar',
    },
    expectedFormat: 'SELECT count(DISTINCT "foo") FROM "bar"',
    expectedValues:  [],
  });

  testFormat({
    query: {
      select: [{ count: { table: 'foo', schema: 'public', field: 'bar' } }],
    },
    expectedFormat: 'SELECT count("public"."foo"."bar")',
    expectedValues:  [],
  });

  testFormat({
    query: {
      select: [{ count: { table: 'foo', schema: 'public', all: true } }],
    },
    expectedFormat: 'SELECT count("public"."foo".*)',
    expectedValues:  [],
  });

  testFormat({
    query: {
      select: [
        { min: { table: 'foo', field: 'count' } },
        { max: { table: 'foo', field: 'count' } },
      ],
    },
    expectedFormat: 'SELECT min("foo"."count"), max("foo"."count")',
    expectedValues:  [],
  });

  testFormat({
    query: {
      select: [
        { value: 12, alias: 'foo' },
        { value: 10, alias: 'bar' },
        { value: 12, alias: 'foobar' },
      ],
    },
    expectedFormat: 'SELECT $1 AS "foo", $2 AS "bar", $1 AS "foobar"',
    expectedValues:  [12, 10],
  });

  testFormat({
    query: {
      select: ['bar'],
      from: {
        table: 'foo',
      },
      joins: [
        {
          from: 'bar',
          type: 'inner',
          on: {
            and: [
              {
                left: { table: 'bar', field: 'bar' },
                right: { table: 'foo', field: 'foo' },
                operand: '=',
              },
            ],
          },
        },
      ],
    },
    expectedFormat: 'SELECT $1 FROM "foo" JOIN "bar" ON "bar"."bar" = "foo"."foo"',
    expectedValues:  ['bar'],
  });

  testFormat({
    query: {
      select: ['bar'],
      from: {
        table: 'foo',
      },
      joins: [
        {
          from: 'bar',
          type: 'left',
          on: {
            left: { table: 'bar', field: 'bar' },
            right: { table: 'foo', field: 'foo' },
            operand: '=',
          },
        },
      ],
    },
    expectedFormat: 'SELECT $1 FROM "foo" LEFT JOIN "bar" ON "bar"."bar" = "foo"."foo"',
    expectedValues:  ['bar'],
  });

  testFormat({
    query: {
      select: [],
      from: {
        table: 'foo',
      },
      where: {
        left: { field: 'bar' },
        operand: 'in',
        value: [1, 2],
      },
    },
    expectedFormat: 'SELECT FROM "foo" WHERE "bar" IN ($1, $2)',
    expectedValues:  [1, 2],
  });

  testFormat({
    query: {
      select: [],
      from: {
        table: 'foo',
      },
      where: {
        left: { field: 'bar' },
        operand: 'not in',
        value: ['bar'],
      },
    },
    expectedFormat: 'SELECT FROM "foo" WHERE "bar" NOT IN ($1)',
    expectedValues:  ['bar'],
  });

  testFormat({
    query: {
      select: [],
      from: {
        table: 'foo',
      },
      where: {
        left: { field: 'bar' },
        operand: 'not in',
        value: {
          select: [{ field: 'id' }],
          from: 'foo',
        },
      },
    },
    expectedFormat: 'SELECT FROM "foo" WHERE "bar" NOT IN (SELECT "id" FROM "foo")',
    expectedValues:  [],
  });

  testFormat({
    query: {
      select: ['bar'],
      from: {
        table: 'foo',
      },
      joins: [
        {
          from: 'bar',
          type: 'cross',
          on: {
            left: { table: 'bar', field: 'bar' },
            right: { table: 'foo', field: 'foo' },
            operand: '>=',
          },
        },
      ],
    },
    expectedFormat:
      'SELECT $1 FROM "foo" CROSS JOIN "bar" ON "bar"."bar" >= "foo"."foo"',
    expectedValues:  ['bar'],
  });

  testFormat({
    query: {
      select: ['bar'],
      from: {
        table: 'foo',
      },
      joins: [
        {
          from: 'bar',
          type: 'right',
          on: {
            left: { table: 'bar', field: 'bar' },
            right: { table: 'foo', field: 'foo' },
            operand: '>=',
          },
        },
      ],
    },
    expectedFormat:
      'SELECT $1 FROM "foo" RIGHT JOIN "bar" ON "bar"."bar" >= "foo"."foo"',
    expectedValues:  ['bar'],
  });

  testFormat({
    query: {
      select: ['bar'],
      from: {
        table: 'foo',
      },
      joins: [
        {
          from: 'bar',
          type: 'full',
          on: {
            left: { table: 'bar', field: 'bar' },
            right: { table: 'foo', field: 'foo' },
            operand: '>=',
          },
        },
      ],
    },
    expectedFormat: 'SELECT $1 FROM "foo" FULL JOIN "bar" ON "bar"."bar" >= "foo"."foo"',
    expectedValues:  ['bar'],
  });

  testFormat({
    query: {
      select: ['bar'],
      from: {
        table: 'foo',
      },
      where: {
        left: { field: 'foo' },
        operand: '!=',
        right: { field: 'bar' },
      },
    },
    expectedFormat: 'SELECT $1 FROM "foo" WHERE "foo" != "bar"',
    expectedValues:  ['bar'],
  });

  testFormat({
    query: {
      select: ['bar'],
      from: {
        table: 'foo',
      },
      where: {
        or: [
          {
            left: { field: 'foo' },
            operand: '>',
            right: { field: 'bar' },
          },
          {
            left: { field: 'foo' },
            operand: '<',
            right: { field: 'bar' },
          },
        ],
      },
    },
    expectedFormat: 'SELECT $1 FROM "foo" WHERE "foo" > "bar" OR "foo" < "bar"',
    expectedValues:  ['bar'],
  });

  testFormat({
    query: {
      select: ['bar'],
      from: {
        table: 'foo',
      },
      where: {
        and: [
          {
            left: { field: 'foo' },
            operand: '!=',
            right: { field: 'bar' },
          },
          {
            or: [
              {
                left: { field: 'foo' },
                operand: '<',
                right: { field: 'bar' },
              },
              {
                left: { field: 'foo' },
                operand: '>',
                right: { field: 'bar' },
              },
            ],
          },
        ],
      },
    },
    expectedFormat:
      'SELECT $1 FROM "foo" WHERE "foo" != "bar" AND ("foo" < "bar" OR "foo" > "bar")',
    expectedValues:  ['bar'],
  });

  testFormat({
    query: {
      select: ['bar'],
      from: {
        table: 'foo',
      },
      where: {
        or: [
          {
            left: { field: 'foo' },
            operand: '!=',
            right: { field: 'bar' },
          },
          {
            and: [
              {
                left: { field: 'foo' },
                operand: '<',
                right: { field: 'bar' },
              },
              {
                left: { field: 'foo' },
                operand: '>',
                right: { field: 'bar' },
              },
            ],
          },
        ],
      },
    },
    expectedFormat:
      'SELECT $1 FROM "foo" WHERE "foo" != "bar" OR ("foo" < "bar" AND "foo" > "bar")',
    expectedValues:  ['bar'],
  });

  testFormat({
    query: {
      select: [1],
      from: {
        schema: 'public',
        table: 'foo',
        alias: 'f',
      },
      joins: [
        {
          from: { table: 'bar', alias: 'b' },
          type: 'inner',
          on: {
            and: [
              {
                left: { table: 'b', field: 'bar' },
                right: { table: 'f', field: 'foo' },
                operand: '=',
              },
            ],
          },
        },
      ],
    },
    expectedFormat:
      'SELECT $1 FROM "public"."foo" AS "f" JOIN "bar" AS "b" ON "b"."bar" = "f"."foo"',
    expectedValues:  [1],
  });

  testFormat({
    query: {
      select: [
        { count: { table: 'f', field: 'bar' } },
        { avg: { table: 'f', field: 'foo' } },
      ],
      from: {
        table: 'foo',
      },
      groupBy: [{ table: 'f', field: 'id' }],
      having: {
        left: { count: { table: 'f', field: 'id' } },
        operand: '>',
        right: 3,
      },
    },
    expectedFormat:
      'SELECT count("f"."bar"), avg("f"."foo") FROM "foo" GROUP BY "f"."id" HAVING count("f"."id") > $1',
    expectedValues:  [3],
  });

  testFormat({
    query: {
      select: [
        {
          concat: [
            'bar',
            { field: 'foobar' },
            { table: 'foo', field: 'bar' },
            { select: [1] },
          ],
        },
      ],
      from: {
        table: 'foo',
      },
    },
    expectedFormat: 'SELECT concat($1, "foobar", "foo"."bar", (SELECT $2)) FROM "foo"',
    expectedValues:  ['bar', 1],
  });
});
