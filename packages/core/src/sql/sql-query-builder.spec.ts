import {SqlQueryBuilder} from './sql-query-builder';
import {SqlQuery} from './sql-query';
import {SqlRawValue} from './sql-raw-value';

function testQuery(expectedResult: { query: SqlQuery, sql: string, values: SqlRawValue[] }) {
  it(`should "${expectedResult.sql}"`, () => {
    const result = new SqlQueryBuilder(expectedResult.query);
    expect(result.sql).toEqual(expectedResult.sql);
    expect(result.values).toEqual(expectedResult.values);
  });
}

describe('sql-query-builder', () => {
  describe('select', () => {
    testQuery({
      query: {
        select: [1],
      },
      sql: 'SELECT $1',
      values: [1],
    });

    testQuery({
      query: {
        select: [{all: true}],
      },
      sql: 'SELECT *',
      values: [],
    });

    testQuery({
      query: {
        select: [{all: true, table: 'foo'}],
        from: {
          table: 'foo',
        },
      },
      sql: 'SELECT "foo".* FROM "foo"',
      values: [],
    });

    testQuery({
      query: {
        select: [
          {table: 'f', alias: 'test', field: 'foo'},
        ],
        from: {
          schema: 'public',
          table: 'foo',
          alias: 'f',
        },
        where: {
          and: [
            {left: {table: 'f', field: 'foo'}, right: {table: 'f', field: 'bar'}, operand: '='},
          ],
        },
      },
      sql: 'SELECT "f"."foo" AS "test" FROM "public"."foo" AS "f" WHERE "f"."foo" = "f"."bar"',
      values: [],
    });

    testQuery({
      query: {
        select: [
          {table: 'f', alias: 'test', field: 'foo'},
        ],
        from: {
          schema: 'public',
          table: 'foo',
          alias: 'f',
        },
        where: {
          and: [
            {
              left: 'foo',
              right: {select: ['foo'], from: {schema: 'public', table: 'foo', alias: 'foo'}},
              operand: '<=',
            },
          ],
        },
      },
      sql: 'SELECT "f"."foo" AS "test" FROM "public"."foo" AS "f" WHERE $1 <= (SELECT $1 FROM "public"."foo" AS "foo")',
      values: ['foo'],
    });

    testQuery({
      query: {
        select: [
          {field: 'foo'},
        ],
        from: {
          table: 'foo',
        },
        where: {
          left: {field: 'foo'},
          operand: 'like',
          right: 'foo',
        },
      },
      sql: 'SELECT "foo" FROM "foo" WHERE "foo" LIKE $1',
      values: ['foo'],
    });


    testQuery({
      query: {
        select: [
          {count: {all: true}},
          {field: 'foo'},
        ],
        from: {
          table: 'foo',
        },
        groupBy: [2],
      },
      sql: 'SELECT count(*), "foo" FROM "foo" GROUP BY $1',
      values: [2],
    });

    testQuery({
      query: {
        select: [
          {field: 'foo'},
        ],
        from: {
          table: 'foo',
        },
        limit: 10,
        offset: 20,
      },
      sql: 'SELECT "foo" FROM "foo" LIMIT $1 OFFSET $2',
      values: [10, 20],
    });

    testQuery({
      query: {
        select: [
          {select: [{field: 'bar'}], from: 'bar'},
        ],
        from: {
          table: 'foo',
        },
      },
      sql: 'SELECT (SELECT "bar" FROM "bar") FROM "foo"',
      values: [],
    });

    testQuery({
      query: {
        select: [
          {select: [{field: 'bar'}], from: 'bar', alias: 'f'},
        ],
        from: {
          table: 'foo',
        },
      },
      sql: 'SELECT (SELECT "bar" FROM "bar") AS "f" FROM "foo"',
      values: [],
    });

    testQuery({
      query: {
        select: [
          {table: 'f', field: 'foo'},
        ],
        from: {
          select: ['foo'],
          alias: 'f',
        },
      },
      sql: 'SELECT "f"."foo" FROM (SELECT $1) AS "f"',
      values: ['foo'],
    });

    testQuery({
      query: {
        select: [
          {all: true},
        ],
        from: {
          select: ['foo'],
        },
      },
      sql: 'SELECT * FROM (SELECT $1)',
      values: ['foo'],
    });

    testQuery({
      query: {
        select: [
          {count: {distinct: true, field: 'foo'}},
        ],
        from: 'bar',
      },
      sql: 'SELECT count(DISTINCT "foo") FROM "bar"',
      values: [],
    });

    testQuery({
      query: {
        select: [
          {count: {table: 'foo', schema: 'public', field: 'bar'}},
        ],
      },
      sql: 'SELECT count("public"."foo"."bar")',
      values: [],
    });

    testQuery({
      query: {
        select: [
          {count: {table: 'foo', schema: 'public', all: true}},
        ],
      },
      sql: 'SELECT count("public"."foo".*)',
      values: [],
    });

    testQuery({
      query: {
        select: [
          {min: {table: 'foo', field: 'count'}},
          {max: {table: 'foo', field: 'count'}},
        ],
      },
      sql: 'SELECT min("foo"."count"), max("foo"."count")',
      values: [],
    });

    testQuery({
      query: {
        select: [
          {value: 12, alias: 'foo'},
          {value: 10, alias: 'bar'},
          {value: 12, alias: 'foobar'},
        ],
      },
      sql: 'SELECT $1 AS "foo", $2 AS "bar", $1 AS "foobar"',
      values: [12, 10],
    });

    testQuery({
      query: {
        select: [
          'bar',
        ],
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
                  left: {table: 'bar', field: 'bar'},
                  right: {table: 'foo', field: 'foo'},
                  operand: '=',
                },
              ],
            },
          },
        ],
      },
      sql: 'SELECT $1 FROM "foo" JOIN "bar" ON "bar"."bar" = "foo"."foo"',
      values: ['bar'],
    });

    testQuery({
      query: {
        select: [
          'bar',
        ],
        from: {
          table: 'foo',
        },
        joins: [
          {
            from: 'bar',
            type: 'left',
            on: {
              left: {table: 'bar', field: 'bar'},
              right: {table: 'foo', field: 'foo'},
              operand: '=',
            },
          },
        ],
      },
      sql: 'SELECT $1 FROM "foo" LEFT JOIN "bar" ON "bar"."bar" = "foo"."foo"',
      values: ['bar'],
    });

    testQuery({
      query: {
        select: [],
        from: {
          table: 'foo',
        },
        where: {
          left: {field: 'bar'},
          operand: 'in',
          value: [1, 2],
        },
      },
      sql: 'SELECT FROM "foo" WHERE "bar" IN ($1, $2)',
      values: [1, 2],
    });

    testQuery({
      query: {
        select: [],
        from: {
          table: 'foo',
        },
        where: {
          left: {field: 'bar'},
          operand: 'not in',
          value: ['bar'],
        },
      },
      sql: 'SELECT FROM "foo" WHERE "bar" NOT IN ($1)',
      values: ['bar'],
    });

    testQuery({
      query: {
        select: [],
        from: {
          table: 'foo',
        },
        where: {
          left: {field: 'bar'},
          operand: 'not in',
          value: {
            select: [{field: 'id'}],
            from: 'foo',
          },
        },
      },
      sql: 'SELECT FROM "foo" WHERE "bar" NOT IN (SELECT "id" FROM "foo")',
      values: [],
    });

    testQuery({
      query: {
        select: [
          'bar',
        ],
        from: {
          table: 'foo',
        },
        joins: [
          {
            from: 'bar',
            type: 'cross',
            on: {
              left: {table: 'bar', field: 'bar'},
              right: {table: 'foo', field: 'foo'},
              operand: '>=',
            },
          },
        ],
      },
      sql: 'SELECT $1 FROM "foo" CROSS JOIN "bar" ON "bar"."bar" >= "foo"."foo"',
      values: ['bar'],
    });

    testQuery({
      query: {
        select: [
          'bar',
        ],
        from: {
          table: 'foo',
        },
        joins: [
          {
            from: 'bar',
            type: 'right',
            on: {
              left: {table: 'bar', field: 'bar'},
              right: {table: 'foo', field: 'foo'},
              operand: '>=',
            },
          },
        ],
      },
      sql: 'SELECT $1 FROM "foo" RIGHT JOIN "bar" ON "bar"."bar" >= "foo"."foo"',
      values: ['bar'],
    });

    testQuery({
      query: {
        select: [
          'bar',
        ],
        from: {
          table: 'foo',
        },
        joins: [
          {
            from: 'bar',
            type: 'full',
            on: {
              left: {table: 'bar', field: 'bar'},
              right: {table: 'foo', field: 'foo'},
              operand: '>=',
            },
          },
        ],
      },
      sql: 'SELECT $1 FROM "foo" FULL JOIN "bar" ON "bar"."bar" >= "foo"."foo"',
      values: ['bar'],
    });

    testQuery({
      query: {
        select: [
          'bar',
        ],
        from: {
          table: 'foo',
        },
        where: {
          left: {field: 'foo'},
          operand: '!=',
          right: {field: 'bar'},
        },
      },
      sql: 'SELECT $1 FROM "foo" WHERE "foo" != "bar"',
      values: ['bar'],
    });

    testQuery({
      query: {
        select: [
          'bar',
        ],
        from: {
          table: 'foo',
        },
        where: {
          or: [
            {
              left: {field: 'foo'},
              operand: '>',
              right: {field: 'bar'},
            },
            {
              left: {field: 'foo'},
              operand: '<',
              right: {field: 'bar'},
            },
          ],

        },
      },
      sql: 'SELECT $1 FROM "foo" WHERE "foo" > "bar" OR "foo" < "bar"',
      values: ['bar'],
    });

    testQuery({
      query: {
        select: [
          'bar',
        ],
        from: {
          table: 'foo',
        },
        where: {
          and: [
            {
              left: {field: 'foo'},
              operand: '!=',
              right: {field: 'bar'},
            },
            {
              or: [
                {
                  left: {field: 'foo'},
                  operand: '<',
                  right: {field: 'bar'},
                },
                {
                  left: {field: 'foo'},
                  operand: '>',
                  right: {field: 'bar'},
                },
              ],
            },
          ],
        },
      },
      sql: 'SELECT $1 FROM "foo" WHERE "foo" != "bar" AND ("foo" < "bar" OR "foo" > "bar")',
      values: ['bar'],
    });

    testQuery({
      query: {
        select: [
          'bar',
        ],
        from: {
          table: 'foo',
        },
        where: {
          or: [
            {
              left: {field: 'foo'},
              operand: '!=',
              right: {field: 'bar'},
            },
            {
              and: [
                {
                  left: {field: 'foo'},
                  operand: '<',
                  right: {field: 'bar'},
                },
                {
                  left: {field: 'foo'},
                  operand: '>',
                  right: {field: 'bar'},
                },
              ],
            },
          ],
        },
      },
      sql: 'SELECT $1 FROM "foo" WHERE "foo" != "bar" OR ("foo" < "bar" AND "foo" > "bar")',
      values: ['bar'],
    });

    testQuery({
      query: {
        select: [
          1,
        ],
        from: {
          schema: 'public',
          table: 'foo',
          alias: 'f',
        },
        joins: [
          {
            from: {table: 'bar', alias: 'b'},
            type: 'inner',
            on: {
              and: [
                {
                  left: {table: 'b', field: 'bar'},
                  right: {table: 'f', field: 'foo'},
                  operand: '=',
                },
              ],
            },
          },
        ],
      },
      sql: 'SELECT $1 FROM "public"."foo" AS "f" JOIN "bar" AS "b" ON "b"."bar" = "f"."foo"',
      values: [1],
    });

    testQuery({
      query: {
        select: [
          {count: {table: 'f', field: 'bar'}},
          {avg: {table: 'f', field: 'foo'}},
        ],
        from: {
          table: 'foo',
        },
        groupBy: [
          {table: 'f', field: 'id'},
        ],
        having: {
          left: {count: {table: 'f', field: 'id'}},
          operand: '>',
          right: 3,
        },
      },
      sql: 'SELECT count("f"."bar"), avg("f"."foo") FROM "foo" GROUP BY "f"."id" HAVING count("f"."id") > $1',
      values: [3],
    });


    testQuery({
      query: {
        select: [
          {
            concat: [
              'bar',
              {field: 'foobar'},
              {table: 'foo', field: 'bar'},
              {select: [1]},
            ],
          },
        ],
        from: {
          table: 'foo',
        },
      },
      sql: 'SELECT concat($1, "foobar", "foo"."bar", (SELECT $2)) FROM "foo"',
      values: ['bar', 1],
    });
  });

  describe('update', () => {
    testQuery({
      query: {
        update: 'foo',
        set: {
          bar: 1,
        },
      },
      sql: 'UPDATE "foo" SET "bar" = $1',
      values: [1],
    });

    testQuery({
      query: {
        update: {schema: 'public', table: 'foo'},
        set: {
          bar: 1,
        },
        where: {
          left: {field: 'foo'},
          operand: '=',
          right: 1,
        },
      },
      sql: 'UPDATE "public"."foo" SET "bar" = $1 WHERE "foo" = $1',
      values: [1],
    });
  });

  describe('delete', () => {
    testQuery({
      query: {
        delete: 'foo',
      },
      sql: 'DELETE FROM "foo"',
      values: [],
    });

    testQuery({
      query: {
        delete: 'foo',
        where: {
          left: 1,
          operand: '!=',
          right: 2,
        },
      },
      sql: 'DELETE FROM "foo" WHERE $1 != $2',
      values: [1, 2],
    });
  });

  describe('insert', () => {
    testQuery({
      query: {
        insert: 'foo',
        values: [{bar: 1,foo: 2}],
      },
      sql: 'INSERT INTO "foo" ("bar", "foo") VALUES ($1, $2)',
      values: [1, 2],
    });

    testQuery({
      query: {
        insert: 'foo',
        values: [{bar:1, foo:2}, {bar:1, foo:1}],
      },
      sql: 'INSERT INTO "foo" ("bar", "foo") VALUES ($1, $2), ($1, $1)',
      values: [1, 2],
    });

    testQuery({
      query: {
        insert: 'foo',
        values: {
          select: [{field: 'bar'}, {field: 'bar'}],
          from: 'bar',
        },
      },
      sql: 'INSERT INTO "foo" ("bar", "foo") SELECT "bar", "bar" FROM "bar"',
      values: [],
    });
  });
});