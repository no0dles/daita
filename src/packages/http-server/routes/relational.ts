import { Request, Response, Router } from 'express';
import { validateExecBody } from '../middleswares/validate-body.middleware';
import { ContextManager, TransactionContextManager } from '../../http-server-common/context-manager';
import { AppOptions } from '../../http-server-common/app-options';
import { TransactionManager } from '../../http-server-common/transaction-manager';
import { Context, TransactionContext } from '../../orm';
import { isTransactionContext } from '../../orm/context/transaction-context';
import { getRequestContext } from '../get-request-context';

export function relationalRoute(ctx: TransactionContext<any> | Context<any>, options: AppOptions) {
  const router = relationalDataRoute(ctx, options);
  if (isTransactionContext(ctx)) {
    extendTransactionRoutes(ctx, options, router);
  }
  return router;
}

function extendTransactionRoutes(ctx: TransactionContext<any>, options: AppOptions, router: Router) {
  const manager = new TransactionContextManager(options);

  function getTransactionId(req: Request, res: Response): string | null {
    if (typeof req.params['tid'] === 'string') {
      return req.params['tid'];
    } else {
      res.status(400).json({ message: 'tid param is required' });
    }
    return null;
  }

  async function getTransaction(req: Request, res: Response, fn: (transaction: TransactionManager) => Promise<any>) {
    const tid = getTransactionId(req, res);
    if (!tid) {
      return;
    }

    const transaction = manager.get(tid);
    await fn(transaction);

    if (tid) {
      res.setHeader('X-Transaction', tid);
      res.setHeader('X-Transaction-Timeout', transaction.getTimeout());
    }
  }

  router.post('/trx/:tid/exec', validateExecBody, async (req, res, next) => {
    try {
      await getTransaction(req, res, async (transaction) => {
        const result = await transaction.exec(req.body.sql);
        res.status(200).json(result);
      });
    } catch (e) {
      next(e);
    }
  });

  router.post('/trx/:tid', async (req, res, next) => {
    try {
      const tid = getTransactionId(req, res);
      if (!tid) {
        return;
      }

      const transaction = manager.create(getRequestContext(ctx, req), tid);
      await transaction.started;
      res.setHeader('X-Transaction', tid);
      res.status(200).send();
    } catch (e) {
      next(e);
    }
  });

  router.post('/trx/:tid/commit', async (req, res, next) => {
    try {
      await getTransaction(req, res, async (transaction) => {
        await transaction.commit();
        res.status(200).send();
      });
    } catch (e) {
      next(e);
    }
  });

  router.post('/trx/:tid/rollback', async (req, res, next) => {
    try {
      await getTransaction(req, res, async (transaction) => {
        await transaction.rollback();
        res.status(200).send();
      });
    } catch (e) {
      next(e);
    }
  });
}

export function relationalDataRoute(ctx: Context<any>, options: AppOptions) {
  const router = Router();

  router.post('/exec', validateExecBody, async (req, res, next) => {
    try {
      const context = new ContextManager(getRequestContext(ctx, req));
      const result = await context.exec(req.body.sql);
      res.status(200).json(result);
    } catch (e) {
      next(e);
    }
  });

  return router;
}
