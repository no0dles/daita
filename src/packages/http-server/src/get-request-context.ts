import { Request } from 'express';
import { HttpServerOptions, HttpServerRelationalOptions } from '@daita/http-server-common';
import { AuthorizedTransactionContext, TransactionContext } from '@daita/orm';
import { getRequestUser, hasRequestUser, getRequiredRequestUserProp } from '@daita/http-server-common';

export function getRequestContext(
  req: Request,
  options: HttpServerOptions,
  relationalOptions: HttpServerRelationalOptions,
): AuthorizedTransactionContext<any> | TransactionContext<any> {
  if (!options.authorization || options.authorization.disableRules) {
    return relationalOptions.context;
  }
  if (hasRequestUser(req)) {
    return relationalOptions.context.authorize({
      userId: `${getRequiredRequestUserProp(req, 'iss')}|${getRequiredRequestUserProp(req, 'sub')}`,
      isAuthorized: true,
      roles: getRequestUser(req)?.roles || [],
    });
  } else {
    return relationalOptions.context.authorize({
      isAuthorized: false,
      roles: [],
      userId: undefined,
    });
  }
}
