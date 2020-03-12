import * as express from 'express';
import {TableInformation} from '@daita/core/dist/context/table-information';
import {
  count,
  insert,
  remove,
  select,
  update,
} from '../functions';
import {AppOptions} from '../app-options';
import {ContextManager} from '../context-manager';

const getTable = (name: string): TableInformation<any> => {
  return {name};
};

export function relationalApi(options: AppOptions): express.Router {
  const router = express.Router();
  const manager = new ContextManager(options);

  router.post('/raw', async (req, res, next) => {
    try {
      const context = manager.getContext({
        migrationId: undefined,
        user: req.user,
        transactionId: req.query.tid,
      });
      const result = await context.raw(req.body.sql, req.body.values || []);

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

  router.post('/:migration/insert/:table', async (req, res, next) => {
    try {
      const context = manager.getContext({
        migrationId: req.params.migration,
        user: req.user,
        transactionId: req.query.tid,
      });
      const type = getTable(req.params.table);
      await insert(type, context, req.body);
      if (req.query.tid) {
        res.setHeader('X-Transaction', req.query.tid);
        res.setHeader('X-Transaction-Timeout', manager.getTransactionTimeout(req.query.tid));
      }
      res.status(201).end();
    } catch (e) {
      next(e);
    }
  });

  router.post('/:migration/select/:table', async (req, res, next) => {
    try {
      const schema = manager.getMigration(req.params.migration);
      const dataAdapter = manager.getDataAdapter(req.query.tid);
      const type = getTable(req.params.table);
      const result = await select(type, dataAdapter, schema, req.body, req.user);
      if (req.query.tid) {
        res.setHeader('X-Transaction', req.query.tid);
        res.setHeader('X-Transaction-Timeout', manager.getTransactionTimeout(req.query.tid));
      }
      res.status(200).json(result);
    } catch (e) {
      next(e);
    }
  });

  router.post('/:migration/count/:table', async (req, res, next) => {
    try {
      const context = manager.getContext({
        migrationId: req.params.migration,
        user: req.user,
        transactionId: req.query.tid,
      });
      const type = getTable(req.params.table);
      const result = await count(type, context, req.body);
      if (req.query.tid) {
        res.setHeader('X-Transaction', req.query.tid);
        res.setHeader('X-Transaction-Timeout', manager.getTransactionTimeout(req.query.tid));
      }
      res.status(200).json(result);
    } catch (e) {
      next(e);
    }
  });

  router.post('/:migration/delete/:table', async (req, res, next) => {
    try {
      const context = manager.getContext({
        migrationId: req.params.migration,
        user: req.user,
        transactionId: req.query.tid,
      });
      const type = getTable(req.params.table);
      const result = await remove(type, context, req.body);
      if (req.query.tid) {
        res.setHeader('X-Transaction', req.query.tid);
        res.setHeader('X-Transaction-Timeout', manager.getTransactionTimeout(req.query.tid));
      }
      res.status(200).json(result);
    } catch (e) {
      next(e);
    }
  });

  router.post('/:migration/update/:table', async (req, res, next) => {
    try {
      const context = manager.getContext({
        migrationId: req.params.migration,
        user: req.user,
        transactionId: req.query.tid,
      });
      const type = getTable(req.params.table);
      const result = await update(type, context, req.body);
      if (req.query.tid) {
        res.setHeader('X-Transaction', req.query.tid);
        res.setHeader('X-Transaction-Timeout', manager.getTransactionTimeout(req.query.tid));
      }
      res.status(200).json(result);
    } catch (e) {
      next(e);
    }
  });

  return router;
}