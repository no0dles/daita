import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as verifyRoute from './routes/verify';
import * as resetRoute from './routes/reset';
import * as registerRoute from './routes/register';
import * as refreshRoute from './routes/refresh';
import * as loginRoute from './routes/login';
import * as resendRoute from './routes/resend';
import * as wellKnownRoute from './routes/well-known';
import * as helmet from 'helmet';
import { cors } from './middlewares/cors';

export const app = express();

app.use(helmet());
app.use(bodyParser.json());

app.use('/:userPoolId/verify', verifyRoute);
app.use(
  '/:userPoolId/reset',
  cors((req) => req.params.userPoolId),
  resetRoute,
);
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
  '/:userPoolId/login',
  cors((req) => req.params.userPoolId),
  loginRoute,
);
app.use('/.well-known', wellKnownRoute);

app.use(
  (
    err: any,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) => {
    console.log(err);
    if (process.env.NODE_ENV === 'production') {
      res.status(500).end();
    } else {
      res.status(500).json({ message: err.message });
    }
  },
);
