import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../modules/token';
import { createLogger } from '@daita/common';
import * as httpServ from '@daita/http-server';
import { setRequestUser } from '@daita/http-server';

const logger = createLogger({ package: 'auth-server', middleware: 'auth' });
export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.header('Authorization');
    if (!authHeader) {
      return res.status(401).end();
    }

    if (!authHeader.startsWith('Bearer ')) {
      return res.status(401).end();
    }

    const token = authHeader.substr('Bearer '.length);
    try {
      const user = await verifyToken(token);
      if (!user) {
        return res.status(401).end();
      }
      console.log(httpServ);
      const pa = require.resolve('@daita/http-server');
      setRequestUser(req, user);
      next();
    } catch (e) {
      logger.error(e);
      res.status(401).end();
    }
  } catch (e) {
    next(e);
  }
};
