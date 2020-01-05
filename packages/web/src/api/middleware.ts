import * as express from 'express';
import {TableInformation} from '@daita/core/dist/context/table-information';
import {
  count,
  insert,
  raw,
  remove,
  select,
  update,
} from '../functions';
import {AppOptions} from '../app-options';
import {ContextManager} from '../context-manager';

const getTable = (name: string): TableInformation<any> => {
  return {name: name};
};

export function relationalMiddleware(options: AppOptions): express.Router {
  const router = express.Router();
  const manager = new ContextManager(options);

  router.post('/raw', async (req, res, next) => {
    try {
      const result = await raw(manager.getDataAdapter(req.query.tid), req.body);
      res.status(200).json(result);
    } catch (e) {
      next(e);
    }
  });

  router.post('/trx/:tid', async (req, res, next) => {
    try {
      await manager.beginTransaction(req.params.tid);
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
      const context = manager.getContext(req.params.migration, req.query.tid);
      const type = getTable(req.params.table);
      await insert(type, context, req.body);
      res.status(201).end();
    } catch (e) {
      next(e);
    }
  });

  router.post('/:migration/select/:table', async (req, res, next) => {
    try {
      const context = manager.getContext(req.params.migration, req.query.tid);
      const type = getTable(req.params.table);
      const result = await select(type, context, req.body);
      res.status(200).json(result);
    } catch (e) {
      next(e);
    }
  });

  router.post('/:migration/count/:table', async (req, res, next) => {
    try {
      const context = manager.getContext(req.params.migration, req.query.tid);
      const type = getTable(req.params.table);
      const result = await count(type, context, req.body);
      res.status(200).json(result);
    } catch (e) {
      next(e);
    }
  });

  router.post('/:migration/delete/:table', async (req, res, next) => {
    try {
      const context = manager.getContext(req.params.migration, req.query.tid);
      const type = getTable(req.params.table);
      const result = await remove(type, context, req.body);
      res.status(200).json(result);
    } catch (e) {
      next(e);
    }
  });

  router.post('/:migration/update/:table', async (req, res, next) => {
    try {
      const context = manager.getContext(req.params.migration, req.query.tid);
      const type = getTable(req.params.table);
      const result = await update(type, context, req.body);
      res.status(200).json(result);
    } catch (e) {
      next(e);
    }
  });

  return router;
}