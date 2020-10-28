import * as jwt from 'express-jwt';
import * as express from 'express';
import * as JwksClient from 'jwks-rsa';
import { AppAuthorizationProvider } from '../../http-server-common/app-authorization';
import { HttpError } from '../http-error';
import { NextFunction, Request, Response } from 'express';

export function jwtAuth(providers: AppAuthorizationProvider[]) {
  const clients: { [key: string]: JwksClient.JwksClient } = {};
  for (const provider of providers) {
    console.log('registered ' + provider.issuer + ' at ' + provider.uri);
    clients[provider.issuer] = JwksClient({
      jwksUri: provider.uri,
    });
  }

  return async (req: Request, res: Response, next: NextFunction) => {
    if (req.user) {
      return next();
    }

    jwt({
      algorithms: ['RS256', 'RS384', 'RS512'],
      secret: (req: express.Request, header: any, payload: any, done: (err: any, secret?: string | Buffer) => void) => {
        if (!payload) {
          return done(null, undefined);
        }
        const client = clients[payload.iss];
        if (!client) {
          return done(new HttpError(400, `unknown token provider "${payload.iss}"`), undefined);
        }
        client.getSigningKey(header.kid, (err, key) => {
          if (err) {
            done(err);
          } else {
            done(err, key.getPublicKey());
          }
        });
      },
    })(req, res, next);
  };
}
