import { Request } from 'express';
import { HttpServerOptions, HttpServerRelationalOptions } from './http-server-options';
import { getRequestUser, getRequiredRequestUserProp, hasRequestUser } from './get-request-user';
import { RelationalAdapter, RuleContext } from '@daita/relational';
import { authorizable, isOrmRelationalSchema, MigrationTree } from '@daita/orm';
import { authorizable as relationalAuthorizable } from '@daita/relational';

export function getRequestContext(req: Request): RuleContext {
  if (hasRequestUser(req)) {
    return {
      userId: `${getRequiredRequestUserProp(req, 'iss')}|${getRequiredRequestUserProp(req, 'sub')}`,
      isAuthorized: true,
      roles: getRequestUser(req)?.roles || [],
    };
  } else {
    return {
      isAuthorized: false,
      roles: [],
      userId: undefined,
    };
  }
}

type Resolver = (req: RuleContext) => RelationalAdapter<any>;

function getResolver(options: HttpServerOptions, relationalOptions: HttpServerRelationalOptions): Resolver {
  if (!options.authorization || options.authorization.rules === 'disabled') {
    return () => relationalOptions.dataAdapter;
  }
  const rules = options.authorization.rules;
  if (rules instanceof Array) {
    const auth = relationalAuthorizable(relationalOptions.dataAdapter, {
      rules,
    });
    return (ctx) => auth.authorize(ctx);
  } else if (rules instanceof MigrationTree) {
    const auth = authorizable(relationalOptions.dataAdapter, {
      migrationTree: rules,
    });
    return (ctx) => auth.authorize(ctx);
  } else if (isOrmRelationalSchema(rules)) {
    const auth = authorizable(relationalOptions.dataAdapter, {
      schema: rules,
    });
    return (ctx) => auth.authorize(ctx);
  } else {
    const auth = authorizable(relationalOptions.dataAdapter, {
      schemaName: rules.schemaName,
    });
    return (ctx) => auth.authorize(ctx);
  }
}

export class RequestAdapterResolver {
  private readonly resolver: Resolver;

  constructor(private options: HttpServerOptions, private relationalOptions: HttpServerRelationalOptions) {
    this.resolver = getResolver(options, relationalOptions);
  }

  getAdapter(req: Request) {
    const context = getRequestContext(req);
    return this.resolver(context);
  }
}
