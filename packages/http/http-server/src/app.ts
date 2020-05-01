import {relationalRoute} from './routes/relational';
import * as express from 'express';
import * as cors from 'cors';
import * as bodyParser from 'body-parser';
import {AppOptions, isTokenProvider} from '@daita/http-server-common';
import {authTokenMiddleware} from './middlewares/auth';
import {failNever} from '@daita/common';

export function createHttpServer(options: AppOptions) {
  const app = express();
  app.use(cors());
  app.use(bodyParser.json());
  if (options.authProvider) {
    if (isTokenProvider(options.authProvider)) {
      app.use(authTokenMiddleware(options.authProvider));
    } else {
      failNever(options.authProvider, 'unknown auth provider');
    }
  }
  app.use('/api/relational', relationalRoute(options));
  app.use(
    (
      err: any,
      req: express.Request,
      res: express.Response,
      next: express.NextFunction,
    ) => {
      res.status(500);
      if (process.env.NODE_ENV === 'production') {
        res.json({message: 'internal error'});
      } else {
        res.json({message: err.message});
      }
    },
  );
  return app;
}
