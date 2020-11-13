import express from 'express';
import * as http from 'http';
import * as bodyParser from 'body-parser';
import wellKnownRoute from './routes/well-known';
import helmet from 'helmet';
import { userPoolCors } from './middlewares/user-pool-cors';
import { TransactionClient } from '../relational/client/transaction-client';
import { resendRoute } from './routes/resend';
import { tokenRoute } from './routes/token';
import { verifyRoute } from './routes/verify';
import { registerRoute } from './routes/register';
import { refreshRoute } from './routes/refresh';
import { loginRoute } from './routes/login';
import { Server } from 'http';

declare global {
  namespace Express {
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

export function createAuthApp(client: TransactionClient<any>, port: number): Promise<Server> {
  const app = express();

  app.use(helmet());
  app.use(bodyParser.json());

  app.use('/:userPoolId/verify', verifyRoute(client));
  app.use(
    '/:userPoolId/register',
    userPoolCors(client, (req) => req.params.userPoolId),
    registerRoute(client),
  );
  app.use(
    '/:userPoolId/refresh',
    userPoolCors(client, (req) => req.params.userPoolId),
    refreshRoute(client),
  );
  app.use(
    '/:userPoolId/resend',
    userPoolCors(client, (req) => req.params.userPoolId),
    resendRoute(client),
  );
  app.use(
    '/:userPoolId/token',
    userPoolCors(client, (req) => req.params.userPoolId),
    tokenRoute(client),
  );
  app.use(
    '/:userPoolId/login',
    userPoolCors(client, (req) => req.params.userPoolId),
    loginRoute(client),
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

  return new Promise<http.Server>((resolve) => {
    const server = app.listen(port, () => {
      resolve(server);
    });
  });
}
