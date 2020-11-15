import * as express from 'express';
import { UnauthorizedError } from 'express-jwt';
import { HttpError } from '../http-error';
import { RuleError } from '../../orm/error/rule-error';
import { TimeoutError } from '../../relational/error/timeout-error';

export function errorMiddleware() {
  return (err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    if (err instanceof UnauthorizedError) {
      return res.status(err.status).json({ message: err.message });
    }
    if (err instanceof HttpError) {
      return res.status(err.statusCode).json({ message: err.responseMessage });
    }
    if (err instanceof RuleError) {
      return res.status(403).json({ error: 'RuleError', message: err.message });
    }
    if (err instanceof TimeoutError) {
      return res.status(400).json({ error: 'TimeoutError', message: err.message });
    }

    res.status(500);
    if (process.env.NODE_ENV === 'production') {
      res.json({ message: 'internal error' });
    } else {
      res.json({ message: err.message });
    }
  };
}
