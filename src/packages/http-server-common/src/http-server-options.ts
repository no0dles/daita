import { HttpServerAuthorization } from './http-server-authorization';
import { MigrationContext } from '@daita/orm/context/get-migration-context';

export interface HttpServerOptions {
  relational?: HttpServerRelationalOptions;
  cors?: boolean | string | string[];
  authorization: HttpServerAuthorization | false;
}

export interface HttpServerRelationalOptions {
  context: MigrationContext<any>;
  enableTransactions: boolean;
  transactionTimeout?: number;
}
