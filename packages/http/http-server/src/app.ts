import { relationalRoute } from './routes/relational';
import * as express from 'express';
import * as jwt from 'express-jwt';
import * as JwksClient from 'jwks-rsa';
import * as cors from 'cors';
import * as bodyParser from 'body-parser';
import { AppOptions } from '@daita/http-server-common';

export function createHttpServer(options: AppOptions) {
  const app = express();
  if (options.cors === true) {
    app.use(cors());
  } else if (typeof options.cors === 'string') {
    app.use(cors({
      origin: options.cors,
    }));
  }
  app.use(bodyParser.json());
  if (options.authorization && options.authorization.providers && options.authorization.providers.length > 0) {
    const clients: { [key: string]: JwksClient.JwksClient } = {};
    for (const provider of options.authorization.providers) {
      clients[provider.issuer] = JwksClient({
        jwksUri: provider.uri,
      });
    }
    app.use(jwt({
      algorithms: ['RS256', 'RS384', 'RS512'],
      secret: (req: express.Request, header: any, payload: any, done: (err: any, secret?: string | Buffer) => void) => {
        const client = clients[payload.iss];
        client.getSigningKey(header.kid, (err, key) => {
          if (err) {
            done(err);
          } else {
            done(err, key.getPublicKey());
          }
        });
      },
    }));
  }
  if (options.authorization && options.authorization.tokens && options.authorization.tokens.length > 0) {
    const tokenMap = options.authorization.tokens.reduce((map, token) => {
      map.set(token.token, token.userId);
      return map;
    }, new Map<string, string>());

    app.use((req, res, next) => {
      if (req.user) {
        return next();
      }

      if (!req.headers.authorization || !req.headers.authorization.startsWith('Token ')) {
        return next();
      }

      const token = req.headers.authorization.substr('Token '.length);
      const userId = tokenMap.get(token);
      if (userId) {
        req.user = {
          type: 'token',
          token: token,
          userId: userId,
        };
      }

      next();
    });
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
        res.json({ message: 'internal error' });
      } else {
        res.json({ message: err.message });
      }
    },
  );
  return app;
}
