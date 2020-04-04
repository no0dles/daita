import * as express from 'express';
import {ContextUser} from '@daita/core/dist/auth';
import {TokenProvider} from '../auth/token-provider';
import {UserProvider} from '../auth/user-provider';

declare global {
  namespace Express {
    export interface Request {
      user: ContextUser;
    }
  }
}

export function authMiddleware(options: { tokenProvider: TokenProvider, userProvider: UserProvider }): express.RequestHandler {
  return async (req, res, next) => {
    const authorization = req.header('authorization');
    if (!authorization || !authorization.startsWith('Bearer ')) {
      req.user = {anonymous: true};
      return next();
    }
    try {
      const token = authorization.substr('Bearer '.length);
      const tokenPayload = await options.tokenProvider.verify(token);
      const user = await options.userProvider.get(tokenPayload);
      req.user = user;
      next();
    } catch (e) {
      next(e);
    }
  };
}
