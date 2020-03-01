import {Pool} from 'pg';
import {PostgresDataAdapter} from './postgres.data-adapter';
import {dropDatabase} from './postgres.util';
import {MigrationDescription} from '@daita/core';
import {MigrationSchema} from '@daita/core/dist/schema/migration-schema';
import {MigrationSchemaTable} from '@daita/core/dist/schema/migration-schema-table';
import {MigrationSchemaTableField} from '@daita/core/dist/schema/migration-schema-table-field';
import {RelationalDataAdapterFactory} from '@daita/core/dist/test/test-utils';
import {relationalDataAdapterTest} from '@daita/core/dist/adapter/relational-data-adapter.test';
import {relationalContextTest} from '@daita/core/dist/context/relational-context.test';

class MockedPool {
  private expectedQuery: string = '';
  private expectedValues: any[] = [];
  private expectedResult: any;

  expect(
    query: string,
    values: any[],
    result: { rowCount?: number; rows?: any[] },
  ) {
    this.expectedQuery = query;
    this.expectedValues = values;
    this.expectedResult = result;
  }

  pool(): Pool {
    return <any>{
      connect: async () => {
        return {
          query: (query: string, values: any[]) => {
            expect(query).toEqual(this.expectedQuery);
            expect(values).toEqual(this.expectedValues);

            return this.expectedResult;
          },
          release: () => {
          },
        };
      },
    };
  }
}

const sourceMigration: MigrationDescription = {id: 'init', steps: []};

class MockedSchema extends MigrationSchema {
  constructor() {
    super(
      'init',
      {},
      {
        author: new MigrationSchemaTable('author', sourceMigration, [
          new MigrationSchemaTableField(
            'name',
            'string',
            true,
            null,
            sourceMigration,
            'name',
          ),
          new MigrationSchemaTableField(
            'test',
            'string',
            true,
            null,
            sourceMigration,
            'test',
          ),
        ]),
      },
    );
  }
}

export class PostgresDataAdapterFactory implements RelationalDataAdapterFactory<PostgresDataAdapter> {
  async create() {
    const connectionString = (process.env.POSTGRES_URI || 'postgres://postgres:postgres@localhost') + '/test-' + Math.random().toString(36).substring(2, 15);
    await dropDatabase(connectionString);

    const dataAdapter = new PostgresDataAdapter(connectionString);
    return {
      close: async() => {
        await dataAdapter.close();
        await dropDatabase(connectionString);
      },
      dataAdapter,
    }
  }
}


describe('postgres.data-adapter', () => {

  relationalDataAdapterTest(new PostgresDataAdapterFactory());
  relationalContextTest(new PostgresDataAdapterFactory());

  const mockedPool = new MockedPool();
  const mockedSchema = new MockedSchema();

  it('select * from author where name = foo', async () => {
    mockedPool.expect(
      'SELECT "base"."name_init" "base.name", "base"."test_init" "base.test" FROM "author_init" "base" WHERE "name_init" = $1',
      ['foo'],
      {rows: [{'base.name': 'foo'}]},
    );
    const adapter = new PostgresDataAdapter(mockedPool.pool());
    const result = await adapter.select(mockedSchema, 'author', {
      filter: {name: 'foo'},
      orderBy: [],
      include: [],
      limit: null,
      skip: null,
    });
    expect(result).toEqual([{name: 'foo'}]);
  });

  it('select * from author', async () => {
    mockedPool.expect('SELECT "base"."name_init" "base.name", "base"."test_init" "base.test" FROM "author_init" "base"', [], {
      rows: [{'base.name': 'foo'}],
    });
    const adapter = new PostgresDataAdapter(mockedPool.pool());
    const result = await adapter.select(mockedSchema, 'author', {
      filter: null,
      orderBy: [],
      include: [],
      limit: null,
      skip: null,
    });
    expect(result).toEqual([{name: 'foo'}]);
  });

  it('delete from author where name = foo', async () => {
    mockedPool.expect(
      'DELETE FROM "author_init" WHERE "name_init" = $1',
      ['foo'],
      {rowCount: 1},
    );
    const adapter = new PostgresDataAdapter(mockedPool.pool());
    const result = await adapter.delete(mockedSchema, 'author', {
      name: 'foo',
    });
    expect(result.affectedRows).toBe(1);
  });

  it('delete from author where name $eq foo', async () => {
    mockedPool.expect(
      'DELETE FROM "author_init" WHERE "name_init" = $1',
      ['foo'],
      {rowCount: 1},
    );
    const adapter = new PostgresDataAdapter(mockedPool.pool());
    const result = await adapter.delete(mockedSchema, 'author', {
      name: {$eq: 'foo'},
    });
    expect(result.affectedRows).toBe(1);
  });

  it('update author set test=bar where name $eq foo', async () => {
    mockedPool.expect(
      'UPDATE "author_init" SET "test_init" = $1 WHERE "name_init" = $2',
      ['bar', 'foo'],
      {rowCount: 1},
    );
    const adapter = new PostgresDataAdapter(mockedPool.pool());
    const result = await adapter.update(
      mockedSchema,
      'author',
      {
        test: 'bar',
      },
      {
        name: {$eq: 'foo'},
      },
    );
    expect(result.affectedRows).toBe(1);
  });

  it('insert into author values (name=bar), (name=foo)', async () => {
    mockedPool.expect(
      'INSERT INTO "author_init" ("name_init") VALUES ($1), ($2)',
      ['bar', 'foo'],
      {rowCount: 1},
    );
    const adapter = new PostgresDataAdapter(mockedPool.pool());
    const result = await adapter.insert(mockedSchema, 'author', [
      {name: 'bar'},
      {name: 'foo'},
    ]);
  });

  it('insert into author values (name=bar), (test=foo)', async () => {
    mockedPool.expect(
      'INSERT INTO "author_init" ("name_init", "test_init") VALUES ($1, $2), ($3, $4)',
      ['bar', null, null, 'foo'],
      {rowCount: 1},
    );
    const adapter = new PostgresDataAdapter(mockedPool.pool());
    const result = await adapter.insert(mockedSchema, 'author', [
      {name: 'bar'},
      {test: 'foo'},
    ]);
  });
});
