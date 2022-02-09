import { relationalRoute } from './routes/relational';
import express from 'express';
import cors from 'cors';
import * as bodyParser from 'body-parser';
import { jwtAuth } from './middleswares/jwt-auth.middleware';
import { errorMiddleware } from './middleswares/error.middleware';
import { tokenAuth } from './middleswares/token-auth.middleware';
import { RequestListener } from 'http';
import { createLogger } from '@daita/common';
import { ormRoute } from './routes/orm';
import { HttpServerOptions } from './http-server-options';

export function createHttpServerApp(options: HttpServerOptions): RequestListener {
  const app = express();
  const logger = createLogger({ package: 'http-server' });

  if (options.cors === true) {
    app.use(cors());
  } else if (typeof options.cors === 'string') {
    app.use(
      cors({
        origin: options.cors,
      }),
    );
  }
  app.use(bodyParser.json({}));

  if (
    options.authorization &&
    options.authorization.tokenEndpoints &&
    options.authorization.tokenEndpoints.length > 0
  ) {
    app.use(tokenAuth(options.authorization.tokenEndpoints));
  }
  if (options.authorization && options.authorization.providers && options.authorization.providers.length > 0) {
    app.use(jwtAuth(options.authorization.providers));
  }

  app.use('/api/relational', relationalRoute(options));
  app.use('/api/orm', ormRoute(options));

  app.use(errorMiddleware(logger));

  return app;
}
