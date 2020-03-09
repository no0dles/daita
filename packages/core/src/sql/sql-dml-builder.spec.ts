import {SqlDmlBuilder, SqlDmlQuery} from './sql-dml-builder';

function testQuery(options: { query: SqlDmlQuery, sql: string }) {
  it(`should "${options.sql}"`, () => {
    const builder = new SqlDmlBuilder(options.query);
    expect(builder.sql).toBe(options.sql);
  });
}

describe('sql-dml-builder', () => {
  describe('create table', () => {
    testQuery({
      query: {
        createTable: 'foo',
        ifNotExist: true,
        fields: [
          {name: 'foo', type: 'string', primaryKey: true},
        ],
      },
      sql: 'CREATE TABLE IF NOT EXISTS "foo" ("foo" VARCHAR, PRIMARY KEY ("foo"))',
    });

    testQuery({
      query: {
        createTable: {table: 'foo', schema: 'public'},
        fields: [
          {name: 'foo', type: 'number'},
        ],
      },
      sql: 'CREATE TABLE "public"."foo" ("foo" NUMERIC)',
    });

    testQuery({
      query: {
        createTable: {table: 'foo', schema: 'public'},
        fields: [
          {name: 'foo', type: 'number', primaryKey: true},
          {name: 'bar', type: 'boolean', primaryKey: false, notNull: true},
          {name: 'foobar', type: 'string'},
          {name: 'created', type: 'date', primaryKey: true},
        ],
      },
      sql: 'CREATE TABLE "public"."foo" ("foo" NUMERIC, "bar" BOOLEAN NOT NULL, "foobar" VARCHAR, "created" TIME WITH TIMEZONE, PRIMARY KEY ("foo", "created"))',
    });

    testQuery({
      query: {
        alterTable: {table: 'foo', schema: 'public'},
        add: {
          column: 'foo',
          type: 'number',
        },
      },
      sql: 'ALTER TABLE "public"."foo" ADD COLUMN "foo" NUMERIC',
    });

    testQuery({
      query: {
        alterTable: 'foo',
        add: {
          column: 'foo',
          type: 'number',
        },
      },
      sql: 'ALTER TABLE "foo" ADD COLUMN "foo" NUMERIC',
    });

    testQuery({
      query: {
        alterTable: {table: 'foo', schema: 'public'},
        drop: {
          column: 'foo',
        },
      },
      sql: 'ALTER TABLE "public"."foo" DROP COLUMN "foo"',
    });

    testQuery({
      query: {
        alterTable: {table: 'foo', schema: 'public'},
        add: {
          references: {table: 'bar', primaryKeys: 'id'},
          foreignKey: 'barId',
        },
      },
      sql: 'ALTER TABLE "public"."foo" ADD FOREIGN KEY ("barId") REFERENCES "bar" ("id")',
    });

    testQuery({
      query: {
        alterTable: {table: 'foo', schema: 'public'},
        add: {
          references: {table: 'bar', primaryKeys: ['id']},
          foreignKey: ['barId'],
          constraint: 'fk_bar',
        },
      },
      sql: 'ALTER TABLE "public"."foo" ADD CONSTRAINT "fk_bar" FOREIGN KEY ("barId") REFERENCES "bar" ("id")',
    });

    testQuery({
      query: {
        alterTable: {table: 'foo', schema: 'public'},
        drop: {
          constraint: 'fk_bar',
        },
      },
      sql: 'ALTER TABLE "public"."foo" DROP CONSTRAINT "fk_bar"',
    });

    testQuery({
      query: {
        dropTable: 'foo',
      },
      sql: 'DROP TABLE "foo"',
    });

    testQuery({
      query: {
        dropTable: {table: 'foo', schema: 'public'},
        ifExist: true,
      },
      sql: 'DROP TABLE IF EXISTS "public"."foo"',
    });

    testQuery({
      query: {
        dropTable: {table: 'foo', schema: 'public'},
      },
      sql: 'DROP TABLE "public"."foo"',
    });
  });
});