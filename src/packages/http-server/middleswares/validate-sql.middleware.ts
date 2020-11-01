import * as express from 'express';
import { validateRules } from '../../relational/permission/validate';
import { AppOptions } from '../../http-server-common/app-options';

export function validateSqlRules(options: AppOptions) {
  return (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      let userId: string | undefined;
      let authorized = false;
      if (req.user) {
        authorized = true;
        userId = `${req.user.iss}|${req.user.sub}`;
      }

      const result = validateRules(req.body.sql, options.rules, {
        isAuthorized: authorized,
        userId: userId,
        roles: req.user?.roles,
      });
      console.log('validate rules');
      console.log(result);
      if (result.type === 'allow') {
        next();
      } else if (process.env.NODE_ENV === 'production') {
        res.status(403).end();
      } else {
        res.status(403).json({
          message: result.error,
          path: result.path,
          ruleId: result.ruleId,
        });
      }
    } catch (e) {
      next(e);
    }
  };
}
