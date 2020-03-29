import * as express from 'express';
import {AppOptions} from '../app-options';
import {ContextManager} from '../context-manager';

export function relationalApi(options: AppOptions): express.Router {
  const router = express.Router();
  const manager = new ContextManager(options);

  router.post('/raw', async (req, res, next) => {
    try {
      const result = await manager.raw({sql: req.body.sql, tid: req.query.tid}, req.user);
      if (req.query.tid) {
        res.setHeader('X-Transaction', req.query.tid);
        res.setHeader('X-Transaction-Timeout', manager.getTransactionTimeout(req.query.tid));
      }
      res.status(200).json(result);
    } catch (e) {
      next(e);
    }
  });

  router.post('/trx/:tid', async (req, res, next) => {
    try {
      await manager.beginTransaction(req.params.tid, req.user || null);
      res.setHeader('X-Transaction-Timeout', manager.getTransactionTimeout(req.params.tid));
      res.setHeader('X-Transaction', req.params.tid);
      res.status(200).send();
    } catch (e) {
      next(e);
    }
  });

  router.post('/trx/:tid/commit', async (req, res, next) => {
    try {
      await manager.commitTransaction(req.params.tid);
      res.status(200).send();
    } catch (e) {
      next(e);
    }
  });

  router.post('/trx/:tid/rollback', async (req, res, next) => {
    try {
      await manager.rollbackTransaction(req.params.tid);
      res.status(200).send();
    } catch (e) {
      next(e);
    }
  });

  return router;
}