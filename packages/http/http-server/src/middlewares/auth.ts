import * as express from 'express';
import {SqlPermissions} from '@daita/relational';
import {TokenProvider} from '@daita/http-server-common';

declare global {
  namespace Express {
    export interface Request {
      permissions?: SqlPermissions | null;
    }
  }
}

export function authTokenMiddleware(tokenProvider: TokenProvider): express.RequestHandler {
  return async (req, res, next) => {
    const authorization = req.header('authorization');
    if (!authorization || !authorization.startsWith('Bearer ')) {
      return next();
    }

    try {
      const token = authorization.substr('Bearer '.length);
      const result = await tokenProvider.verify(token);
      req.permissions = result.permissions;
      next();
    } catch (e) {
      next(e);
    }
  };
}
