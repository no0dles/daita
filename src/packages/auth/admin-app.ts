import * as express from 'express';
import * as path from 'path';
import * as bodyParser from 'body-parser';
import * as refreshRoute from './routes/refresh';
import * as adminTokenRoute from './routes/admin-token';
import * as loginRoute from './routes/login';
import { authMiddleware } from './middlewares/auth-middleware';
import * as helmet from 'helmet';
import { allow, anything, authorized } from '../relational/permission/function';
import { relationalRoute } from '../http-server';
import { TransactionClient } from '../relational/client';

export function createAuthAdminApp(client: TransactionClient<any>) {
  const adminApp = express();

  adminApp.client = client;

  adminApp.use(helmet());
  adminApp.use(bodyParser.json());

  adminApp.use('/:userPoolId/refresh', refreshRoute);
  adminApp.use('/:userPoolId/login', loginRoute);
  adminApp.use('/:userPoolId/token', adminTokenRoute);

  adminApp.use(
    '/api/relational',
    authMiddleware,
    relationalRoute({
      authorization: false,
      cors: false,
      rules: [allow(authorized(), anything())],
      transactionTimeout: 4000,
    }),
  );

  adminApp.get('/', (req, res) => {
    return res.sendFile(path.join(process.cwd(), 'www/dist/web/index.html'));
  });

  adminApp.use('/admin', express.static(path.join(process.cwd(), 'www/dist/web')));
  adminApp.get('/admin/*', (req, res, next) => {
    if (req.accepts('html')) {
      return res.sendFile(path.join(process.cwd(), 'www/dist/web/index.html'));
    }

    next();
  });

  adminApp.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.log(err);
    if (process.env.NODE_ENV === 'production') {
      res.status(500).end();
    } else {
      res.status(500).json({ message: err.message });
    }
  });

  return adminApp;
}
