import * as express from 'express';
import { verifyToken } from '../modules/token';
import { createLogger } from '../../common/utils/logger';

const logger = createLogger({ package: 'auth-server', middleware: 'auth' });
export const authMiddleware = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
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
      req.user = user;
      next();
    } catch (e) {
      logger.error(e);
      res.status(401).end();
    }
  } catch (e) {
    next(e);
  }
};
