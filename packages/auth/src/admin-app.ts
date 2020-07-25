import * as express from 'express';
import * as path from 'path';
import * as bodyParser from 'body-parser';
import * as refreshRoute from './routes/refresh';
import * as loginRoute from './routes/login';
import { relationalRoute } from '@daita/http-server';
import { adapter } from './client';
import { allow, anything, authorized } from '@daita/relational';
import { authMiddleware } from './middlewares/auth-middleware';

const app = express();

app.use(bodyParser.json());

app.use('/:userPoolId/refresh', refreshRoute);
app.use('/:userPoolId/login', loginRoute);

app.use('/api/relational', authMiddleware, relationalRoute({
  dataAdapter: adapter,
  cors: false,
  rules: [
    allow(authorized(), anything()),
  ],
  transactionTimeout: 4000,
}));

app.get('/', (req, res) => {
  return res.sendFile(path.join(__dirname, '../www/dist/web/index.html'));
});

app.use('/admin', express.static('www/dist/web'));
app.get('/admin/*', (req, res, next) => {
  if (req.accepts('html')) {
    return res.sendFile(path.join(__dirname, '../www/dist/web/index.html'));
  }

  next();
});

app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.log(err);
  if (process.env.NODE_ENV === 'production') {
    res.status(500).end();
  } else {
    res.status(500).json({ message: err.message });
  }
});

export = app;
