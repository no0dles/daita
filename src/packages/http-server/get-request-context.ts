import { Request } from 'express';
import { Context, TransactionContext } from '../orm';
import { AppOptions } from '../http-server-common';
import { HttpServerDataOptions, HttpServerTransactionOptions } from '../http-server-common/app-options';

export function getRequestContext(req: Request, options: HttpServerTransactionOptions): TransactionContext<any>;
export function getRequestContext(req: Request, options: HttpServerDataOptions): Context<any>;
export function getRequestContext(req: Request, options: AppOptions): Context<any> | TransactionContext<any> {
  if (!options.authorization) {
    return options.context;
  }
  if (req.user) {
    return options.context.authorize({
      userId: `${req.user.iss}|${req.user.sub}`,
      isAuthorized: true,
      roles: req.user?.roles || [],
    });
  } else {
    return options.context.authorize({
      isAuthorized: false,
      roles: [],
      userId: undefined,
    });
  }
}
