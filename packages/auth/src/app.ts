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

const app = express();

app.use(helmet());
app.use(bodyParser.json());

app.use('/:userPoolId/verify', verifyRoute);
app.use('/:userPoolId/reset', resetRoute);
app.use('/:userPoolId/register', registerRoute);
app.use('/:userPoolId/refresh', refreshRoute);
app.use('/:userPoolId/resend', resendRoute);
app.use('/:userPoolId/login', loginRoute);
app.use('/.well-known', wellKnownRoute);

app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.log(err);
  if (process.env.NODE_ENV === 'production') {
    res.status(500).end();
  } else {
    res.status(500).json({ message: err.message });
  }
});

export = app;
