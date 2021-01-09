import { Request } from 'express';
import { AppOptions } from '../http-server-common/app-options';
import { TransactionContext } from '../orm/context/transaction-context';
import { getRequestUser, hasRequestUser, getRequiredRequestUserProp } from '../http-server-common/get-request-user';

export function getRequestContext(req: Request, options: AppOptions): TransactionContext<any> {
  if (!options.authorization || options.authorization.disableRules) {
    return options.context;
  }
  if (hasRequestUser(req)) {
    return options.context.authorize({
      userId: `${getRequiredRequestUserProp(req, 'iss')}|${getRequiredRequestUserProp(req, 'sub')}`,
      isAuthorized: true,
      roles: getRequestUser(req)?.roles || [],
    });
  } else {
    return options.context.authorize({
      isAuthorized: false,
      roles: [],
      userId: undefined,
    });
  }
}
