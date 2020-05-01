import {
  SqlAlterTableQuery,
  SqlCreateTableQuery, SqlFieldType,
  RelationalMigrationAdapter, createMigrationAdapter, SqlSelect, SqlInsert, RelationalDataAdapter
} from "@daita/relational";
import * as pg from "@daita/pg-adapter";
import * as sqlite from "@daita/sqlite-adapter";

async function testValue(adapter: RelationalMigrationAdapter, type: SqlFieldType, value: any) {
  const query: SqlCreateTableQuery = {
    createTable: "foo",
    fields: [
      { name: "val", type: type }
    ]
  };
  await adapter.exec(query);
  const insertSql: SqlInsert = {
    insert: "foo",
    values: [{ val: value }]
  };
  await adapter.exec(insertSql);
  const selectSql: SqlSelect = {
    select: [{ all: true }],
    from: "foo"
  };
  const result = await adapter.exec(selectSql);
  expect(result.rowCount).toBe(1);
  expect(result.rows[0].val).toBe(value);
}

describe("pg/select", () => {
  let adapter: RelationalMigrationAdapter;

  beforeEach(async () => {
    adapter = await createMigrationAdapter({
      database: "test-select",
      connectionString: ':memory:', //"postgres://postgres:postgres@localhost",
      adapter: sqlite, //pg
      createIfNotExists: true,
      dropIfExists: true
    });
  });

  afterEach(async () => {
    await adapter.close();
  });

  it("should create table and insert max number", async () => {
    await testValue(adapter, 'number', Number.MAX_VALUE);
  });
  it("should create table and insert min number", async () => {
    await testValue(adapter, 'number', Number.MIN_VALUE);
  });
  it("should create table and insert 0", async () => {
    await testValue(adapter, 'number', 0);
  });
  it("should create table and insert null", async () => {
    await testValue(adapter, 'number', null);
  });
  it("should create table and insert empty string", async () => {
    await testValue(adapter, 'string', '');
  });
  it("should create table and insert null", async () => {
    await testValue(adapter, 'string', null);
  });

  it("should create table and select count(*)", async () => {
    const query: SqlCreateTableQuery = {
      createTable: "foo",
      fields: [
        { name: "text", type: "string" }
      ]
    };
    await adapter.exec(query);
    const selectCount: SqlSelect = {
      select: [{ count: { all: true }, alias: "cnt" }],
      from: "foo"
    };
    const result = await adapter.exec(selectCount);
    expect(result.rowCount).toBe(1);
    expect(result.rows[0].cnt).toBe(0);
  });

  it("should create table", async () => {
    const query: SqlCreateTableQuery = {
      createTable: "foo",
      fields: [
        { name: "text", type: "string" },
        { name: "num", type: "number" },
        { name: "bool", type: "boolean" },
        { name: "date", type: "date" },
        { name: "textArray", type: "string[]" },
        { name: "numArray", type: "number[]" },
        { name: "boolArray", type: "boolean[]" },
        { name: "dateArray", type: "date[]" }
      ]
    };
    await adapter.exec(query);
  });

  it("should create table and select", async () => {
    const query: SqlCreateTableQuery = {
      createTable: "foo",
      fields: [
        { name: "text", type: "string" },
        { name: "num", type: "number" },
        { name: "bool", type: "boolean" },
        { name: "date", type: "date" },
        { name: "textArray", type: "string[]" },
        { name: "numArray", type: "number[]" },
        { name: "boolArray", type: "boolean[]" },
        { name: "dateArray", type: "date[]" }
      ]
    };
    await adapter.exec(query);
    const data = {
      text: "hey",
      num: 1000,
      bool: true,
      date: new Date(),
      textArray: ["foo", "bar"],
      numArray: [1, 2],
      boolArray: [true, false],
      dateArray: [new Date()]
    };
    await adapter.exec({
      insert: "foo",
      values: [data]
    });
    const result = await adapter.exec({
      select: [{ all: true }],
      from: "foo"
    });
    expect(result.rowCount).toBe(1);
    expect(result.rows[0]).toEqual(data);
  });

  it("should alter table and add column", async () => {
    const query: SqlCreateTableQuery = {
      createTable: "foo",
      fields: [
        { name: "text", type: "string" }
      ]
    };
    await adapter.exec(query);
    const alterQuery: SqlAlterTableQuery = {
      alterTable: "foo",
      add: {
        column: "num",
        type: "number"
      }
    };
    await adapter.exec(alterQuery);
  });

  it("should alter table and drop column", async () => {
    const query: SqlCreateTableQuery = {
      createTable: "foo",
      fields: [
        { name: "text", type: "string" },
        { name: "num", type: "number" }
      ]
    };
    await adapter.exec(query);
    const alterQuery: SqlAlterTableQuery = {
      alterTable: "foo",
      drop: {
        column: "num"
      }
    };
    await adapter.exec(alterQuery);
  });

  it("should create table with foreign key", async () => {
    const queryFoo: SqlCreateTableQuery = {
      createTable: "foo",
      fields: [
        { name: "id", type: "number", primaryKey: true },
        { name: "text", type: "string" }
      ]
    };
    await adapter.exec(queryFoo);
    const queryBar: SqlCreateTableQuery = {
      createTable: "bar",
      fields: [
        { name: "id", type: "number", primaryKey: true },
        { name: "fooId", type: "number" },
        { name: "date", type: "date" }
      ]
    };
    await adapter.exec(queryBar);
    const addForeignKeyQuery: SqlAlterTableQuery = {
      alterTable: "bar",
      add: {
        constraint: "bar_fk",
        foreignKey: "fooId",
        references: {
          primaryKeys: "id",
          table: "foo"
        }
      }
    };
    await adapter.exec(addForeignKeyQuery);
  });
});
