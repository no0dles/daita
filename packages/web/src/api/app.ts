import * as express from 'express';
import * as cors from 'cors';
import * as bodyParser from 'body-parser';
import {relationalApi} from './middleware';
import {AppOptions} from '../app-options';
import * as debug from 'debug';
import {authMiddleware} from './auth';

export function createApiApp(options: AppOptions): express.Express {
  const app = express();
  app.use(cors());
  app.use(bodyParser.json());
  if (options.auth) {
    app.use(authMiddleware(options.auth));
  } else {
    app.use((req, res, next) => {
      req.user = {anonymous: true};
    });
  }
  app.use('/api/table', relationalApi(options));
  app.use(
    (
      err: any,
      req: express.Request,
      res: express.Response,
      next: express.NextFunction,
    ) => {
      debug('daita:web:api')(err.message);
      res.status(500);
      res.json({message: err.message});
    },
  );
  return app;
}
