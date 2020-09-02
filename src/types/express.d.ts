import { TransactionClient } from '../packages/relational/client';

declare global {
  namespace Express {
    export interface Application {
      client: TransactionClient<any>;
    }

    export interface Request {
      user?:
        | {
            type: 'token';
            userId: string;
            token: string;
          }
        | {
            sub: string;
            iss: string;
          };
      token?: { sub: string; issuer: string };
    }
  }
}
