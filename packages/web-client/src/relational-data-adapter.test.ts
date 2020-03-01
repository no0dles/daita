import {RelationalDataAdapterFactory} from '@daita/core/dist/test/test-utils';
import {Defer, RelationalDataAdapter, RelationalSchema} from '@daita/core';
import {createSocketApp} from '@daita/web/dist/socket';
import * as http from "http";
import * as express from 'express';
import {ApiRelationalDataAdapter} from './api-relational-data-adapter';
import {SocketRelationalDataAdapter} from './socket-relational-data-adapter';


export class WebDataAdapterFactory<T extends RelationalDataAdapter> implements RelationalDataAdapterFactory<T> {
  constructor(private relationalDataAdapterFactory: RelationalDataAdapterFactory, private webAdapterFactory: (port: number) => T) {
  }

  async create(schema: RelationalSchema) {
    const backendResult = await this.relationalDataAdapterFactory.create(schema);
    const server = createSocketApp(new http.Server(express()), {
      type: 'schema',
      dataAdapter: backendResult.dataAdapter,
      schema: schema,
      transactionTimeout: 1000,
    });

    const port = 3000 + Math.round(Math.random() * 1000);
    const defer = new Defer();
    server.listen(port, defer.resolve);
    await defer.promise;

    const dataAdapter = this.webAdapterFactory(port);

    return {
      dataAdapter,
      close: async () => {
        const closeDefer = new Defer();
        server.close(closeDefer.resolve);
        await closeDefer.promise;

        await backendResult.close();
      },
    }
  }
}

export class SocketDataAdapterFactory extends WebDataAdapterFactory<SocketRelationalDataAdapter> {
  constructor(relationalDataAdapterFactory: RelationalDataAdapterFactory) {
    super(relationalDataAdapterFactory, port => new SocketRelationalDataAdapter(`http://localhost:${port}`));
  }
}

export class ApiDataAdapterFactory extends WebDataAdapterFactory<ApiRelationalDataAdapter> {
  constructor(relationalDataAdapterFactory: RelationalDataAdapterFactory) {
    super(relationalDataAdapterFactory, port => new ApiRelationalDataAdapter(`http://localhost:${port}`));
  }
}