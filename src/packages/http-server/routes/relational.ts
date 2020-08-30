import * as express from 'express';
import {
  AppDataOptions,
  AppOptions,
  AppTransactionOptions,
  ContextManager,
  isAppTransactionOptions,
  TransactionContextManager,
  TransactionManager,
} from '../../http-server-common';
import { validateRules } from '../../relational/permission';

export function relationalRoute(options: AppOptions) {
  if (isAppTransactionOptions(options)) {
    console.log('transaction route');
    return relationalTransactionRoute(options);
  } else {
    console.log('data route');
    return relationalDataRoute(options);
  }
}

export function relationalTransactionRoute(options: AppTransactionOptions) {
  const router = relationalDataRoute(options);
  const manager = new TransactionContextManager(options);

  function getTransactionId(
    req: express.Request,
    res: express.Response,
  ): string | null {
    if (typeof req.params['tid'] === 'string') {
      return req.params['tid'];
    } else {
      res.status(400).json({ message: 'tid param is required' });
    }
    return null;
  }

  async function getTransaction(
    req: express.Request,
    res: express.Response,
    fn: (transaction: TransactionManager) => Promise<any>,
  ) {
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

  router.post(
    '/trx/:tid/exec',
    validateSqlRules(options),
    async (req, res, next) => {
      try {
        await getTransaction(req, res, async (transaction) => {
          const result = await transaction.exec(req.body.sql);
          res.status(200).json(result);
        });
      } catch (e) {
        next(e);
      }
    },
  );

  router.post('/trx/:tid', async (req, res, next) => {
    try {
      const tid = getTransactionId(req, res);
      if (!tid) {
        return;
      }

      const transaction = manager.create(tid);
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

  return router;
}

export function validateSqlRules(options: AppDataOptions) {
  return (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) => {
    try {
      let userId: string | undefined;
      let authorized = false;
      if ((<any>req).user) {
        authorized = true;
        if ((<any>req).user.type === 'jwt') {
          userId = `${(<any>req).user.iss}|${(<any>req).user.sub}`;
        } else if ((<any>req).user.type === 'token') {
          userId = (<any>req).user.userId;
        } else if ((<any>req).user.type === 'custom') {
          // TODO
        } //TODO failNever and typing
      }

      const result = validateRules(req.body.sql, options.rules, {
        isAuthorized: authorized,
        userId: userId,
      });
      if (result.type === 'allow') {
        next();
      } else if (process.env.NODE_ENV === 'production') {
        res.status(403).end();
      } else {
        if (options.rules.length === 0) {
          res.status(403).json({
            messages: ['no rules defined'],
          });
        } else {
          res.status(403).json({
            messages: result.details,
          });
        }
      }
    } catch (e) {
      next(e);
    }
  };
}

export function relationalDataRoute(options: AppDataOptions) {
  const router = express.Router();

  router.post('/exec', validateSqlRules(options), async (req, res, next) => {
    try {
      const context = new ContextManager(options.dataAdapter);
      const result = await context.exec(req.body.sql);
      res.status(200).json(result);
    } catch (e) {
      next(e);
    }
  });

  return router;
}
