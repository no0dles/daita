import express from 'express';
import * as bodyParser from 'body-parser';
import wellKnownRoute from './routes/well-known';
import helmet from 'helmet';
import { userPoolCors } from './middlewares/user-pool-cors';
import { resendRoute } from './routes/resend';
import { tokenRoute } from './routes/token';
import { verifyRoute } from './routes/verify';
import { registerRoute } from './routes/register';
import { refreshRoute } from './routes/refresh';
import { loginRoute } from './routes/login';
import { Server } from 'http';
import { createLogger } from '../common/utils/logger';
import { TransactionContext } from '../orm/context/transaction-context';
import { responseTimeMetricMiddleware } from './middlewares/response-time-middleware';

export function createAuthApp(ctx: TransactionContext<any>, port: number) {
  const app = express();
  const logger = createLogger({ package: 'auth-server' });

  app.use(responseTimeMetricMiddleware('auth'));
  app.use(helmet());
  app.use(bodyParser.json());

  app.use('/:userPoolId/verify', verifyRoute(ctx));
  app.use(
    '/:userPoolId/register',
    userPoolCors(ctx, (req) => req.params.userPoolId),
    registerRoute(ctx),
  );
  app.use(
    '/:userPoolId/refresh',
    userPoolCors(ctx, (req) => req.params.userPoolId),
    refreshRoute(ctx),
  );
  app.use(
    '/:userPoolId/resend',
    userPoolCors(ctx, (req) => req.params.userPoolId),
    resendRoute(ctx),
  );
  app.use(
    '/:userPoolId/token',
    userPoolCors(ctx, (req) => req.params.userPoolId),
    tokenRoute(ctx),
  );
  app.use(
    '/:userPoolId/login',
    userPoolCors(ctx, (req) => req.params.userPoolId),
    loginRoute(ctx),
  );
  app.use('/:userPoolId/.well-known', wellKnownRoute);

  app.use((req, res) => {
    res.status(404).json({ message: 'not found' }).end();
  });

  app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    logger.error(err);
    if (process.env.NODE_ENV === 'production') {
      res.status(500).end({ message: 'internal error' });
    } else {
      res.status(500).json({ message: err.message });
    }
  });

  return new Promise<Server>((resolve) => {
    const server = app.listen(port, () => {
      resolve(server);
      logger.info(`auth server is running on http://localhost:${port}`);
    });
  });
}
