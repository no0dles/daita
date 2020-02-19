import * as http from "http";
import {RelationalContext, RelationalSchema} from '@daita/core';
import * as express from 'express';
import {createSocketApp} from '@daita/web/dist/socket';
import {SocketRelationalDataAdapter} from './socket-relational-data-adapter';
import {AdapterTest} from '@daita/core/dist/test/test-utils';
import {PostgresAdapterTest} from '@daita/core/dist/postgres/postgres.data-adapter.spec';
import {relationalDataAdapterTest} from '@daita/core/dist/adapter/relational-data-adapter.test';
import testSchema = require('@daita/core/dist/test/schema');

export class SocketAdapterTest implements AdapterTest {
  private server: http.Server | null = null;

  name = 'socket-data-adapter';
  context!: RelationalContext;
  dataAdapter!: SocketRelationalDataAdapter;
  isRemote = true;

  constructor(private port: number,
              private backendSetup: AdapterTest,
              private schema: RelationalSchema) {
  }

  async after(): Promise<any> {
    await this.backendSetup.after();
    if (this.dataAdapter) {
      this.dataAdapter.close();
    }
    await new Promise<any>(resolve => {
      if (this.server) {
        this.server.close(resolve);
      } else {
        resolve();
      }
    });
  }

  async before(): Promise<any> {
    await this.backendSetup.before();
    await new Promise<any>(resolve => {
      this.server = createSocketApp(new http.Server(express()), {
        type: 'schema',
        dataAdapter: this.backendSetup.dataAdapter,
        schema: this.schema,
        transactionTimeout: 1000,
      });
      this.server.listen(this.port, resolve);
    });
    this.dataAdapter = new SocketRelationalDataAdapter(
      `http://localhost:${this.port}`,
    );
    this.context = this.schema.context(this.dataAdapter);
  }
}

describe('socket-relational-data-adapter', () => {
  const postgresUri = process.env.POSTGRES_URI || 'postgres://postgres:postgres@localhost';

  relationalDataAdapterTest(
    new SocketAdapterTest(3002, new PostgresAdapterTest(`${postgresUri}/socket-test`, testSchema), testSchema));
});
