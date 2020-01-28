import * as express from 'express';
import {ContextUser} from '@daita/core/dist/auth';
import {TokenProvider} from '../auth/token-provider';
import {UserProvider} from '../auth/user-provider';

declare global {
  namespace Express {
    export interface Request {
      user?: ContextUser;
    }
  }
}

export function authMiddleware(options: { tokenProvider: TokenProvider, userProvider: UserProvider }): express.RequestHandler {
  return (req, res, next) => {
    const authorization = req.header('authorization');
    if (!authorization || !authorization.startsWith('Bearer ')) {
      return next();
    }

    const token = authorization.substr('Bearer '.length);
    options.tokenProvider.verify(token)
      .then(tokenPayload => options.userProvider.get(tokenPayload))
      .then(user => {
        req.user = user;
        next();
      })
      .catch(err => {
        next(err);
      });
  };
}