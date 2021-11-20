import * as express from 'express';
import { HttpError } from '../http-error';
import { RuleError } from '@daita/orm/error/rule-error';
import { TimeoutError } from '@daita/relational/error/timeout-error';
import { Logger } from '@daita/common/utils/logger';

export function errorMiddleware(logger: Logger) {
  const isProduction = process.env.NODE_ENV === 'production';
  return (err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    if (err instanceof HttpError) {
      return res.status(err.statusCode).json({ message: err.responseMessage });
    }
    if (err instanceof RuleError) {
      const data = { error: 'RuleError', message: err.message, detail: isProduction ? undefined : err.result };
      logger.warn(`rule error`, {
        message: err.message,
        detail: err.result,
      });
      return res.status(403).json(data);
    }
    if (err instanceof TimeoutError) {
      return res.status(400).json({ error: 'TimeoutError', message: err.message });
    }

    logger.error(err);
    res.status(500);
    if (isProduction) {
      res.json({ message: 'internal error' });
    } else {
      res.json({ message: err.message });
    }
  };
}
