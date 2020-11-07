import express from 'express';
import * as bodyParser from 'body-parser';
import verifyRoute from './routes/verify';
import registerRoute from './routes/register';
import refreshRoute from './routes/refresh';
import loginRoute from './routes/login';
import resendRoute from './routes/resend';
import tokenRoute from './routes/token';
import wellKnownRoute from './routes/well-known';
import helmet from 'helmet';
import { cors } from './middlewares/cors';
import { TransactionClient } from '../relational/client/transaction-client';

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

export function createAuthApp(client: TransactionClient<any>) {
  const app = express();
  app.client = client;

  app.use(helmet());
  app.use(bodyParser.json());

  app.use('/:userPoolId/verify', verifyRoute);
  app.use(
    '/:userPoolId/register',
    cors((req) => req.params.userPoolId),
    registerRoute,
  );
  app.use(
    '/:userPoolId/refresh',
    cors((req) => req.params.userPoolId),
    refreshRoute,
  );
  app.use(
    '/:userPoolId/resend',
    cors((req) => req.params.userPoolId),
    resendRoute,
  );
  app.use(
    '/:userPoolId/token',
    cors((req) => req.params.userPoolId),
    tokenRoute,
  );
  app.use(
    '/:userPoolId/login',
    cors((req) => req.params.userPoolId),
    loginRoute,
  );
  app.use('/:userPoolId/.well-known', wellKnownRoute);

  app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.log(err);
    if (process.env.NODE_ENV === 'production') {
      res.status(500).end();
    } else {
      res.status(500).json({ message: err.message });
    }
  });

  return app;
}
