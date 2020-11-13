import { Request } from 'express';
import { Context, TransactionContext } from '../orm';

export function getRequestContext(ctx: TransactionContext<any>, req: Request): TransactionContext<any>;
export function getRequestContext(ctx: Context<any>, req: Request): Context<any>;
export function getRequestContext(
  ctx: Context<any> | TransactionContext<any>,
  req: Request,
): Context<any> | TransactionContext<any> {
  if (req.user) {
    return ctx.authorize({
      userId: `${req.user.iss}|${req.user.sub}`,
      isAuthorized: true,
      roles: req.user?.roles || [],
    });
  } else {
    return ctx.authorize({
      isAuthorized: false,
      roles: [],
      userId: undefined,
    });
  }

  // return (req: express.Request, res: express.Response, next: express.NextFunction) => {
  //   try {
  //     let userId: string | undefined;
  //     let authorized = false;
  //     if (req.user) {
  //       authorized = true;
  //       userId = `${req.user.iss}|${req.user.sub}`;
  //     }
  //
  //     const result = validateRules(req.body.sql, options.rules, {
  //       isAuthorized: authorized,
  //       userId: userId,
  //       roles: req.user?.roles,
  //     });
  //     console.log('validate rules');
  //     console.log(result);
  //     if (result.type === 'allow') {
  //       next();
  //     } else if (process.env.NODE_ENV === 'production') {
  //       res.status(403).end();
  //     } else {
  //       res.status(403).json({
  //         message: result.error,
  //         path: result.path,
  //         ruleId: result.ruleId,
  //       });
  //     }
  //   } catch (e) {
  //     next(e);
  //   }
  // };
}
