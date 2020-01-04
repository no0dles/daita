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

// router.post('/:migration/transaction', async (req, res, next) => {
//   const result: { results: { success: boolean; result: any, message?: string }[]; success: boolean } = {
//     results: [],
//     success: true,
//   };
//
//   try {
//     const context = getContext(req.params.migration);
//     await context
//       .transaction(async (trx) => {
//         for (const action of req.body.actions) {
//           const type = getTable(action.table, req.params.migration);
//           switch (action.type) {
//             case 'update':
//               result.results.push({result: await update(type, context, action.body), success: true});
//               break;
//             case 'select':
//               result.results.push({result: await select(type, context, action.body), success: true});
//               break;
//             case 'delete':
//               result.results.push({result: await remove(type, context, action.body), success: true});
//               break;
//             case 'insert':
//               result.results.push({result: await insert(type, context, action.body), success: true});
//               break;
//           }
//         }
//       });
//     res.status(200).json(result);
//   } catch (e) {
//     console.log(e);
//     result.results.push({success: false, result: null, message: e.message});
//     result.success = false;
//     //(<any>result).test = true;
//     res.status(409).json(result);
//   }
// });
