import { testFormat } from './test/formatter.test';

describe('create-table-formatter', () => {
  testFormat({
    query: {
      createTable: 'foo',
      ifNotExist: true,
      fields: [{ name: 'foo', type: 'VARCHAR', primaryKey: true }],
    },
    expectedFormat:
      'CREATE TABLE IF NOT EXISTS "foo" ("foo" VARCHAR, PRIMARY KEY ("foo"))',
  });

  testFormat({
    query: {
      createTable: { table: 'foo', schema: 'public' },
      fields: [{ name: 'foo', type: 'NUMERIC' }],
    },
    expectedFormat: 'CREATE TABLE "public"."foo" ("foo" NUMERIC)',
  });

  testFormat({
    query: {
      createTable: { table: 'foo', schema: 'public' },
      fields: [
        { name: 'foo', type: 'NUMERIC', primaryKey: true },
        { name: 'bar', type: 'BOOLEAN', primaryKey: false, notNull: true },
        { name: 'foobar', type: 'VARCHAR' },
        { name: 'created', type: 'TIME WITH TIMEZONE', primaryKey: true },
      ],
    },
    expectedFormat:
      'CREATE TABLE "public"."foo" ("foo" NUMERIC, "bar" BOOLEAN NOT NULL, "foobar" VARCHAR, "created" TIME WITH TIMEZONE, PRIMARY KEY ("foo", "created"))',
  });
});
