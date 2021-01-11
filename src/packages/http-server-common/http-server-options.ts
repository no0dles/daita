import { HttpServerAuthorization } from './http-server-authorization';
import { MigrationContext } from '../orm/context/get-migration-context';
import { IwentAdapter } from '../iwent/iwent-adapter';

export interface HttpServerOptions {
  relational?: HttpServerRelationalOptions;
  iwent?: HttpServerIwentOptions;
  cors?: boolean | string | string[];
  authorization: HttpServerAuthorization | false;
}

export interface HttpServerRelationalOptions {
  context: MigrationContext<any>;
  enableTransactions: boolean;
  transactionTimeout?: number;
}

export interface HttpServerIwentOptions {
  adapter: IwentAdapter;
}
