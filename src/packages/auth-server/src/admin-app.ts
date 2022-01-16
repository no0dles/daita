import express = require('express');
import * as path from 'path';
import * as bodyParser from 'body-parser';
import { authMiddleware } from './middlewares/auth-middleware';
import cors = require('cors');
import { relationalRoute } from '@daita/http-server';
import { adminTokenRoute } from './routes/admin-token';
import { Server } from 'http';
import { createLogger } from '@daita/common';
import { responseTimeMetricMiddleware } from './middlewares/response-time-middleware';
import { loginRoute, refreshRoute } from './routes';
import { RelationalAdapter } from '@daita/relational';
import { RelationalOrmAdapter } from '@daita/orm';

export function createAuthAdminApp(dataAdapter: RelationalAdapter<any> & RelationalOrmAdapter, port: number) {
  const adminApp = express();
  const logger = createLogger({ package: 'auth-server' });

  adminApp.use(responseTimeMetricMiddleware('admin'));
  adminApp.use(bodyParser.json());

  if (process.env.NODE_ENV !== 'production') {
    adminApp.use(cors());
  }

  adminApp.use('/:userPoolId/token', adminTokenRoute(dataAdapter));
  adminApp.use('/:userPoolId/login', loginRoute(dataAdapter));
  adminApp.use('/:userPoolId/refresh', refreshRoute(dataAdapter));

  adminApp.use(
    '/api/relational',
    authMiddleware,
    relationalRoute({
      relational: {
        dataAdapter,
        enableTransactions: true,
        transactionTimeout: 4000,
      },
      authorization: false,
      cors: false,
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
