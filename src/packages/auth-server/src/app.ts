import express = require('express');
import * as bodyParser from 'body-parser';
import { wellKnownRoute } from './routes/well-known/jwks';
import * as helmet from 'helmet';
import { userPoolCors } from './middlewares/user-pool-cors';
import { resendRoute } from './routes/resend';
import { tokenRoute } from './routes/token';
import { verifyRoute } from './routes/verify';
import { registerRoute } from './routes/register';
import { refreshRoute } from './routes/refresh';
import { loginRoute } from './routes/login';
import { createLogger, getNumberEnvironmentVariable } from '@daita/common';
import { responseTimeMetricMiddleware } from './middlewares/response-time-middleware';
import { RelationalAdapter } from '@daita/relational';
import { RequestListener } from 'http';
import RateLimit from 'express-rate-limit';

export function createAuthApp(ctx: RelationalAdapter<any>): RequestListener {
  const app = express();
  const logger = createLogger({ package: 'auth-server' });

  app.use(
    RateLimit({
      windowMs: getNumberEnvironmentVariable('RATE_LIMIT_WINDOW', 1 * 60 * 1000), // 1 minute
      max: getNumberEnvironmentVariable('RATE_LIMIT_MAX', 20),
    }),
  );

  app.use(responseTimeMetricMiddleware('auth'));
  app.use(helmet.default());
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

  return app;
}
