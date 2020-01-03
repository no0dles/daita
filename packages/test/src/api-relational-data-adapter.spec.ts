import {PostgresDataAdapter} from '@daita/core/dist/postgres';
import {RelationalContext, RelationalDataAdapter, RelationalTransactionContext} from '@daita/core';
import * as http from 'http';
import {expect} from 'chai';
import {dropDatabase} from '@daita/core/dist/postgres/postgres.util';
import schema = require('./test/schema');
import {User} from './test/user';
import {getApi} from '@daita/web/dist/api/app';
import {ApiRelationalDataAdapter} from '@daita/web-client';

describe('api-relational-data-adapter', () => {
  const postgresConnectionString = 'postgres://postgres:postgres@localhost/api-test';
  const apiPort = 3003;

  let server: http.Server;
  let serverDataAdapter: RelationalDataAdapter;
  let serverContext: RelationalContext;
  let adapter: ApiRelationalDataAdapter;
  let context: RelationalTransactionContext;

  before(async () => {
    await dropDatabase(postgresConnectionString);

    serverDataAdapter = new PostgresDataAdapter(postgresConnectionString);
    serverContext = schema.context(serverDataAdapter);

    await Promise.all(
      [
        serverContext.migration().apply(),
        new Promise<any>((resolve) => {
          const api = getApi({dataAdapter: serverDataAdapter, schema});
          server = api.listen(apiPort, resolve);
        }),
      ],
    );

    adapter = new ApiRelationalDataAdapter(`http://localhost:${apiPort}/api/table`);
    context = schema.context(adapter);
  });

  beforeEach(async () => {
    await serverContext.delete(User).exec();
  });

  after((done) => {
    server.close(done);
  });

  it('should insert', async () => {
    await context.insert(User).value({id: 'a', name: 'foo'}).exec();
    const serverUsers = await serverContext.select(User).exec();
    expect(serverUsers).to.be.deep.eq([{id: 'a', name: 'foo'}]);
  });

  it('should raw', async () => {
    const result = await adapter.raw('SELECT now() as date', []);
    expect(result.rowCount).to.be.eq(1);
    expect(result.rows[0].date).to.not.be.eq(null);
    expect(result.rows[0].date).to.not.be.eq(undefined);
  });

  it('should count', async () => {
    await context.insert(User).value({id: 'a', name: 'foo'}).exec();
    await context.insert(User).value({id: 'b', name: 'foo'}).exec();
    await context.insert(User).value({id: 'c', name: 'bar'}).exec();
    const result = await context.select(User).where({name: 'foo'}).execCount();

    expect(result).to.be.eq(2);
  });

  it('should update', async () => {
    await context.insert(User).value({id: 'a', name: 'foo'}).exec();
    await context.update(User).where({id: 'a'}).set({name: 'bar'}).exec();

    const serverUsers = await serverContext.select(User).exec();
    expect(serverUsers).to.be.deep.eq([{id: 'a', name: 'bar'}]);
  });

  it('should select', async () => {
    await context.insert(User).value({id: 'a', name: 'foo'}).exec();
    await context.insert(User).value({id: 'b', name: 'bar'}).exec();

    const user = await context.select(User).where({name: 'bar'}).execFirst();
    expect(user).instanceof(User);
    expect(user).to.be.deep.eq({id: 'b', name: 'bar'});
  });

  it('should delete', async () => {
    await context.insert(User).value({id: 'a', name: 'foo'}).exec();
    await context.insert(User).value({id: 'b', name: 'bar'}).exec();

    const result = await context.delete(User).where({name: 'bar'}).exec();
    expect(result).to.be.deep.eq({affectedRows: 1});

    const userCount = await serverContext.select(User).execCount();
    expect(userCount).to.be.eq(1);
  });

  it('should return raw error', async () => {
    try {
      await adapter.raw('SELECT foo as date', []);
    } catch (e) {
      expect(e.message).to.be.eq('column "foo" does not exist');
    }
  });
});