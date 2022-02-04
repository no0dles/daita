import * as express from 'express';

export const validateExecBody = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  if (!req.body || !req.body.sql) {
    return res.json({ message: 'missing sql in body' }).status(400);
  }
  return next();
};
