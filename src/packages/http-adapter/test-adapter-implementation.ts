import { RelationalTransactionAdapterImplementation } from '../relational/adapter/relational-adapter-implementation';
import { HttpTransactionAdapter } from './http-transaction-adapter';
import { getRandomTestPort } from '../node/random-port';
import { ContextOptions } from '../orm/context/get-context';
import { HttpAdapterOptions } from './adapter-implementation';
import { Server } from 'http';
import { createHttpServerApp } from '../http-server/app';
import { TransactionContext } from '../orm/context/transaction-context';
import { RelationalTransactionAdapter } from '../relational/adapter/relational-transaction-adapter';
import { Context } from '../orm/context/context';
import { Http } from '../http-client-common/http';

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
