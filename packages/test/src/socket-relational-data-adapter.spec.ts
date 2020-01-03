import * as http from 'http';
import * as express from 'express';
import {expect} from 'chai';
import {
  RelationalContext,
  RelationalDataAdapter, RelationalTransactionContext,
} from '@daita/core';
import {dropDatabase} from '@daita/core/dist/postgres/postgres.util';
import {PostgresDataAdapter} from '@daita/core/dist/postgres';
import {createSocketApp} from '@daita/web/dist/socket/app';
import schema = require('./test/schema');
import {User} from './test/user';
import {SocketRelationalDataAdapter} from '@daita/web-client';

describe('socket-relational-data-adapter', () => {
  const postgresConnectionString = 'postgres://postgres:postgres@localhost/socket-test';
  const apiPort = 3004;

  let server: http.Server;
  let context: RelationalTransactionContext;
  let serverDataAdapter: RelationalDataAdapter;
  let serverContext: RelationalContext;
  let socketAdapter: SocketRelationalDataAdapter;

  before(async () => {
    await dropDatabase(postgresConnectionString);

    serverDataAdapter = new PostgresDataAdapter(postgresConnectionString);
    serverContext = schema.context(serverDataAdapter);

    await serverContext.migration().apply();
  });

  beforeEach(async () => {
    await serverContext.delete(User).exec();
    await new Promise<any>((resolve) => {
      server = createSocketApp(new http.Server(express()), {dataAdapter: serverDataAdapter, schema});
      server.listen(apiPort, resolve);
    });
    socketAdapter = new SocketRelationalDataAdapter(`http://localhost:${apiPort}`);
    context = schema.context(socketAdapter);
  });

  afterEach((done) => {
    if (socketAdapter) {
      socketAdapter.close();
    }
    if (server) {
      server.close(done);
    } else {
      done();
    }
  });

  it('should insert', async () => {
    await context.insert(User).value({id: 'a', name: 'foo'}).exec();
    const serverUsers = await serverContext.select(User).exec();
    expect(serverUsers).to.be.deep.eq([{id: 'a', name: 'foo'}]);
  });

  it('should delete', async () => {
    await context.insert(User).value({id: 'a', name: 'foo'}).exec();
    await context.insert(User).value({id: 'b', name: 'bar'}).exec();
    const result = await context.delete(User).where({id: 'a'}).exec();
    expect(result).to.be.deep.eq({affectedRows: 1});
    const serverUsers = await serverContext.select(User).exec();
    expect(serverUsers).to.be.deep.eq([{id: 'b', name: 'bar'}]);
  });

  it('should select', async () => {
    await context.insert(User).value({id: 'a', name: 'foo'}).exec();
    await context.insert(User).value({id: 'b', name: 'bar'}).exec();
    const users = await context.select(User).where({id: 'a'}).exec();
    expect(users).to.be.deep.eq([{id: 'a', name: 'foo'}]);
  });

  it('should update', async () => {
    await context.insert(User).values({id: 'a', name: 'foo'}).exec();
    await context.insert(User).values({id: 'b', name: 'bar'}).exec();
    const result = await context.update(User).set({name: 'bar'}).where({id: 'a'}).exec();
    expect(result).to.be.deep.eq({affectedRows: 1});
    const serverUsers = await serverContext.select(User).orderBy(s => s.id).exec();
    expect(serverUsers).to.be.deep.eq([
      {id: 'a', name: 'bar'},
      {id: 'b', name: 'bar'},
    ]);
  });

  it('should count', async () => {
    await context.insert(User).values({id: 'a', name: 'foo'}).exec();
    await context.insert(User).values({id: 'b', name: 'bar'}).exec();
    const count = await context.select(User).execCount();
    expect(count).to.be.eq(2);
  });

  it('should raw', async () => {
    const date = await socketAdapter.raw('SELECT now() as date', []);
    expect(date.rowCount).to.be.eq(1);
    expect(date.rows[0].date).to.not.be.eq(null);
    expect(date.rows[0].date).to.not.be.eq(undefined);
  });

  it('should return raw error', async () => {
    try {
      await socketAdapter.raw('SELECT foo as date', []);
    } catch (e) {
      console.log(e);
      expect(e.message).to.be.eq('column "foo" does not exist');
    }
  });
});