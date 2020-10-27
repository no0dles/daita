import * as express from 'express';
import { UnauthorizedError } from 'express-jwt';
import { HttpError } from '../http-error';

export function errorMiddleware() {
  return (err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    if (err instanceof UnauthorizedError) {
      return res.status(err.status).json({ message: err.message });
    }
    if (err instanceof HttpError) {
      return res.status(err.statusCode).json({ message: err.responseMessage });
    }
    res.status(500);
    if (process.env.NODE_ENV === 'production') {
      res.json({ message: 'internal error' });
    } else {
      res.json({ message: err.message });
    }
  };
}
