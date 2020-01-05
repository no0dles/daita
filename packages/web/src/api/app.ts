import * as express from 'express';
import * as http from 'http';
import * as cors from 'cors';
import * as bodyParser from 'body-parser';
import { relationalMiddleware } from './middleware';
import { AppOptions } from '../app-options';
import * as debug from 'debug';

export function createApiApp(options: AppOptions): express.Express {
  const app = express();
  app.use(cors());
  app.use(bodyParser.json());
  app.use('/api/table', relationalMiddleware(options));
  app.use(
    (
      err: any,
      req: express.Request,
      res: express.Response,
      next: express.NextFunction,
    ) => {
      debug('daita:web:api')(err.message);
      res.status(500);
      res.json({ message: err.message });
    },
  );
  return app;
}
