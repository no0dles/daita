import { RelationalOrmAdapter } from '@daita/orm';
import { RelationalAdapter } from '@daita/relational';
import { HttpServerAuthorization } from './http-server-authorization';

export interface HttpServerOptions {
  relational?: HttpServerRelationalOptions;
  cors?: boolean | string | string[];
  authorization: HttpServerAuthorization | false;
}

export interface HttpServerRelationalOptions {
  dataAdapter: RelationalAdapter<any> & RelationalOrmAdapter;
  enableTransactions: boolean;
  transactionTimeout?: number;
}
