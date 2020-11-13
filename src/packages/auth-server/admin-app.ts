import express from 'express';
import * as path from 'path';
import * as bodyParser from 'body-parser';
import { authMiddleware } from './middlewares/auth-middleware';
import helmet from 'helmet';
import cors from 'cors';
import { allow } from '../relational/permission/function/allow';
import { TransactionClient } from '../relational/client/transaction-client';
import { authorized } from '../relational/permission/function/authorized';
import { relationalRoute } from '../http-server/routes/relational';
import { anything } from '../relational/permission/function/anything';
import { refreshRoute } from './routes/refresh';
import { loginRoute } from './routes/login';
import { adminTokenRoute } from './routes/admin-token';
import { Server } from 'http';
import http from 'http';

export function createAuthAdminApp(client: TransactionClient<any>, port: number): Promise<Server> {
  const adminApp = express();

  adminApp.use(helmet());
  adminApp.use(bodyParser.json());

  if (process.env.NODE_ENV !== 'production') {
    adminApp.use(cors());
  }

  adminApp.use('/:userPoolId/refresh', refreshRoute(client));
  adminApp.use('/:userPoolId/login', loginRoute(client));
  adminApp.use('/:userPoolId/token', adminTokenRoute(client));

  adminApp.use(
    '/api/relational',
    authMiddleware,
    relationalRoute(client, {
      authorization: false,
      cors: false,
      rules: [allow(authorized(), anything())],
      transactionTimeout: 4000,
    }),
  );

  adminApp.get('/', (req, res) => {
    return res.redirect('/admin');
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

  return new Promise<http.Server>((resolve) => {
    const server = adminApp.listen(port, () => {
      resolve(server);
    });
  });
}
