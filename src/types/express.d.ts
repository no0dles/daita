import { RelationalTransactionAdapter } from '../packages/relational/adapter';
import { Client, TransactionClient } from '../packages/relational/client';

declare global {
  namespace Express {
    export interface Application {
      adapter: RelationalTransactionAdapter;
      client: TransactionClient<any> & Client<any>;
    }

    export interface Request {
      user?:
        | {
            type: 'token';
            userId: string;
            token: string;
          }
        | {
            type: 'jwt';
            sub: string;
            iss: string;
          }
        | {
            type: 'custom';
          };
      token?: { sub: string; issuer: string };
    }
  }
}
