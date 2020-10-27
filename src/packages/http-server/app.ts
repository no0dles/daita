import { relationalRoute } from './routes/relational';
import * as express from 'express';
import * as cors from 'cors';
import * as bodyParser from 'body-parser';
import { AppOptions } from '../http-server-common';
import { TransactionClient } from '../relational/client';
import { jwtAuth } from './middleswares/jwt-auth.middleware';
import { errorMiddleware } from './middleswares/error.middleware';
import { tokenAuth } from './middleswares/token-auth.middleware';

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

  if (options.authorization && options.authorization.providers && options.authorization.providers.length > 0) {
    app.use(jwtAuth(options.authorization.providers));
  }
  if (options.authorization && options.authorization.tokenEndpoint) {
    app.use(tokenAuth(options.authorization.tokenEndpoint));
  }

  app.use('/api/relational', relationalRoute(options));
  app.use(errorMiddleware());
  return app;
}
