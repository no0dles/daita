import {Pool} from 'pg';
import {PostgresDataAdapter} from './postgres.data-adapter';
import {expect} from 'chai';
import {MigrationSchemaTable} from '../schema/migration-schema-table';
import {MigrationSchema} from '../schema/migration-schema';
import {MigrationSchemaTableField} from '../schema/migration-schema-table-field';
import {MigrationDescription} from '../migration';

class MockedPool {
  private expectedQuery: string = '';
  private expectedValues: any[] = [];
  private expectedResult: any;

  expect(query: string, values: any[], result: { rowCount?: number, rows?: any[] }) {
    this.expectedQuery = query;
    this.expectedValues = values;
    this.expectedResult = result;
  }

  pool(): Pool {
    return <any>{
      connect: async () => {
        return {
          query: (query: string, values: any[]) => {
            expect(query).be.eq(this.expectedQuery);
            expect(values).be.deep.eq(this.expectedValues);

            return this.expectedResult;
          },
          release: () => {

          },
        }
      },
    }
  }
}

class MockedSchema extends MigrationSchema {
  constructor() {
    const sourceMigration: MigrationDescription = {id: 'init', steps: []};
    super('init', {}, {
      'author': new MigrationSchemaTable('author', sourceMigration, [
        new MigrationSchemaTableField('name', 'string', true, null, sourceMigration, 'name'),
        new MigrationSchemaTableField('test', 'string', true, null, sourceMigration, 'test')]),
    })
  }
}

describe('postgres.data-adapter', () => {
  const mockedPool = new MockedPool();
  const mockedSchema = new MockedSchema();

  it('select * from author where name = foo', async () => {
    mockedPool.expect('SELECT * FROM "init_author" WHERE "init_name" = $1', ['foo'], {rows: [{init_name: 'foo'}]});
    const adapter = new PostgresDataAdapter(mockedPool.pool());
    const result = await adapter.select(mockedSchema, 'author', {
      filter: {name: 'foo'}, orderBy: [], limit: null, skip: null,
    });
    expect(result).deep.eq([
      {name: 'foo'},
    ]);
  });

  it('select * from author', async () => {
    mockedPool.expect('SELECT * FROM "init_author"', [], {rows: [{init_name: 'foo'}]});
    const adapter = new PostgresDataAdapter(mockedPool.pool());
    const result = await adapter.select(mockedSchema, 'author', {filter: null, orderBy: [], limit: null, skip: null});
    expect(result).deep.eq([
      {name: 'foo'},
    ]);
  });

  it('delete from author where name = foo', async () => {
    mockedPool.expect('DELETE FROM "init_author" WHERE "init_name" = $1', ['foo'], {rowCount: 1});
    const adapter = new PostgresDataAdapter(mockedPool.pool());
    const result = await adapter.delete(mockedSchema, 'author', {
      name: 'foo',
    });
    expect(result.affectedRows).be.eq(1);
  });


  it('delete from author where name $eq foo', async () => {
    mockedPool.expect('DELETE FROM "init_author" WHERE "init_name" = $1', ['foo'], {rowCount: 1});
    const adapter = new PostgresDataAdapter(mockedPool.pool());
    const result = await adapter.delete(mockedSchema, 'author', {
      name: {$eq: 'foo'},
    });
    expect(result.affectedRows).be.eq(1);
  });


  it('update author set test=bar where name $eq foo', async () => {
    mockedPool.expect('UPDATE "init_author" SET "init_test" = $1 WHERE "init_name" = $2', ['bar', 'foo'], {rowCount: 1});
    const adapter = new PostgresDataAdapter(mockedPool.pool());
    const result = await adapter.update(mockedSchema, 'author', {
      test: 'bar',
    }, {
      name: {$eq: 'foo'},
    });
    expect(result.affectedRows).be.eq(1);
  });

  it('insert into author values (name=bar), (name=foo)', async () => {
    mockedPool.expect('INSERT INTO "init_author" ("init_name") VALUES ($1), ($2)', ['bar', 'foo'], {rowCount: 1});
    const adapter = new PostgresDataAdapter(mockedPool.pool());
    const result = await adapter.insert(mockedSchema, 'author', [
      {name: 'bar'},
      {name: 'foo'},
    ]);
  });

  it('insert into author values (name=bar), (test=foo)', async () => {
    mockedPool.expect('INSERT INTO "init_author" ("init_name", "init_test") VALUES ($1, $2), ($3, $4)', ['bar', null, null, 'foo'], {rowCount: 1});
    const adapter = new PostgresDataAdapter(mockedPool.pool());
    const result = await adapter.insert(mockedSchema, 'author', [
      {name: 'bar'},
      {test: 'foo'},
    ]);
  });
});
