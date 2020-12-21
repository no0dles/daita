import { Request } from 'express';
import { AppOptions } from '../http-server-common/app-options';
import { TransactionContext } from '../orm/context/transaction-context';

export function getRequestContext(req: Request, options: AppOptions): TransactionContext<any> {
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
