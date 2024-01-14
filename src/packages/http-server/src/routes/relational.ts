import { Request, Response, Router } from 'express';
import { validateExecBody } from '../middleswares/validate-body.middleware';
import { RequestAdapterResolver } from '../get-request-context';
import { HttpServerOptions, HttpServerRelationalOptions } from '../http-server-options';
import { ContextManager } from '../context-manager';

export function relationalRoute(options: HttpServerOptions):Router {
  const router = Router();

  const relationalOptions = options.relational;
  if (!relationalOptions) {
    return router;
  }

  const resolver = new RequestAdapterResolver(options, relationalOptions);

  extendRelationalDataRoute(resolver, router);
  extendTransactionRoutes(resolver, relationalOptions, router);

  return router;
}

function extendTransactionRoutes(
  resolver: RequestAdapterResolver,
  relationalOptions: HttpServerRelationalOptions,
  router: Router,
) {
  function getTransactionId(req: Request, res: Response): string | null {
    if (typeof req.params['tid'] === 'string') {
      return req.params['tid'];
    } else {
      res.status(400).json({ message: 'tid param is required' });
    }
    return null;
  }

  router.post('/trx/:tid', async (req, res, next) => {
    try {
      const tid = getTransactionId(req, res);
      if (!tid) {
        return;
      }

      const adapter = resolver.getAdapter(req);
      await adapter.transaction((trx) => {
        for (const sql of req.body.sqls) {
          trx.exec(sql);
        }
      });
      res.status(200).send();
    } catch (e) {
      next(e);
    }
  });
}

export function extendRelationalDataRoute(resolver: RequestAdapterResolver, router: Router) {
  router.post('/exec', validateExecBody, async (req, res, next) => {
    try {
      const context = new ContextManager(resolver.getAdapter(req));
      const result = await context.exec(req.body.sql);
      res.status(200).json(result);
    } catch (e) {
      next(e);
    }
  });
}
