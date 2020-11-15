import { RelationalTransactionAdapterImplementation } from '../relational/adapter/relational-adapter-implementation';
import { Http } from '../http-client-common';
import { RelationalTransactionAdapter } from '../relational';
import { HttpTransactionAdapter } from './http-transaction-adapter';
import { getRandomTestPort } from '../node/random-port';
import { createHttpServerApp } from '../http-server';
import { ContextOptions } from '../orm/context/get-context';
import { HttpAdapterOptions } from './adapter-implementation';
import { Context, TransactionContext } from '../orm';
import { Server } from 'http';

export type HttpTestAdapterOptions = ContextOptions & { context: TransactionContext<any> | Context<any> };

export class HttpTestAdapterImplementation
  implements RelationalTransactionAdapterImplementation<any, HttpTestAdapterOptions> {
  constructor(private httpFactory: (options: HttpAdapterOptions) => Http) {}
  getRelationalAdapter(options: HttpTestAdapterOptions): RelationalTransactionAdapter<any> {
    const port = getRandomTestPort();
    const http = this.httpFactory({ baseUrl: `http://localhost:${port}`, authProvider: null });
    let server: Server;
    const init = createHttpServerApp(
      {
        context: options.context,
        authorization: false,
        cors: true,
        transactionTimeout: 2000,
      },
      port,
    ).then((res) => {
      server = res;
    });
    return new HttpTransactionAdapter(http, init, () => {
      server?.close();
      options.context.close();
    });
  }

  supportsQuery<S>(sql: S): this is RelationalTransactionAdapterImplementation<any | S, HttpTestAdapterOptions> {
    return false;
  }
}
