import express from 'express';
import * as path from 'path';
import * as bodyParser from 'body-parser';
import { authMiddleware } from './middlewares/auth-middleware';
import helmet from 'helmet';
import cors from 'cors';
import { relationalRoute } from '../http-server/routes/relational';
import { refreshRoute } from './routes/refresh';
import { loginRoute } from './routes/login';
import { adminTokenRoute } from './routes/admin-token';
import { Server } from 'http';
import { createLogger } from '../common/utils/logger';
import { TransactionContext } from '../orm/context/transaction-context';
import { MigrationContext } from '../orm/context/get-migration-context';

export function createAuthAdminApp(context: MigrationContext<any>, port: number) {
  const adminApp = express();
  const logger = createLogger({ package: 'auth-server' });

  // adminApp.use(helmet());
  adminApp.use(bodyParser.json());

  if (process.env.NODE_ENV !== 'production') {
    adminApp.use(cors());
  }

  adminApp.use('/:userPoolId/refresh', refreshRoute(context));
  adminApp.use('/:userPoolId/login', loginRoute(context));
  adminApp.use('/:userPoolId/token', adminTokenRoute(context));

  adminApp.use(
    '/api/relational',
    authMiddleware,
    relationalRoute({
      context,
      authorization: false,
      enableTransactions: true,
      cors: false,
      transactionTimeout: 4000,
    }),
  );

  adminApp.get('/', (req, res) => {
    return res.redirect('/admin');
  });

  adminApp.use('/admin', express.static(path.join(process.cwd(), 'www')));
  adminApp.get('/admin/*', (req, res, next) => {
    if (req.accepts('html')) {
      return res.sendFile(path.join(process.cwd(), 'www/index.html'));
    }

    next();
  });

  adminApp.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    logger.error(err);
    if (process.env.NODE_ENV === 'production') {
      res.status(500).end();
    } else {
      res.status(500).json({ message: err.message });
    }
  });

  return new Promise<Server>((resolve) => {
    const server = adminApp.listen(port, () => {
      resolve(server);
      logger.info(`auth admin server is running on http://localhost:${port}`);
    });
  });
}
