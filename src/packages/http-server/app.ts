import { relationalRoute } from './routes/relational';
import express from 'express';
import cors from 'cors';
import * as bodyParser from 'body-parser';
import { jwtAuth } from './middleswares/jwt-auth.middleware';
import { errorMiddleware } from './middleswares/error.middleware';
import { tokenAuth } from './middleswares/token-auth.middleware';
import { TransactionClient } from '../relational/client/transaction-client';
import { AppOptions } from '../http-server-common/app-options';

declare global {
  namespace Express {
    export interface Application {
      client: TransactionClient<any>;
    }

    export interface Request {
      user?: {
        sub: string;
        iss: string;
        iat?: number;
        exp?: number;
        roles?: string[];
      };
    }
  }
}

export function createHttpServerApp(client: TransactionClient<any>, options: AppOptions) {
  const app = express();
  app.client = client;

  if (options.cors === true) {
    app.use(cors());
  } else if (typeof options.cors === 'string') {
    app.use(
      cors({
        origin: options.cors,
      }),
    );
  }
  app.use(bodyParser.json());

  if (
    options.authorization &&
    options.authorization.tokenEndpoints &&
    options.authorization.tokenEndpoints.length > 0
  ) {
    app.use(tokenAuth(options.authorization.tokenEndpoints));
  }
  if (options.authorization && options.authorization.providers && options.authorization.providers.length > 0) {
    app.use(jwtAuth(options.authorization.providers));
  }

  app.use('/api/relational', relationalRoute(options));
  app.use(errorMiddleware());
  return app;
}
