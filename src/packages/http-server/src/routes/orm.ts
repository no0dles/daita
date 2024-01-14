import { Router } from 'express';
import { HttpServerOptions } from '../http-server-options';
import { getRequestUser } from '../get-request-user';
import { isOrmAdapter } from '@daita/orm';

export function ormRoute(options: HttpServerOptions):Router {
  const router = Router();

  const ormAdapter = options.relational?.dataAdapter;
  if (!isOrmAdapter(ormAdapter)) {
    return router;
  }

  router.use((req, res, next) => {
    const user = getRequestUser(req);
    const hasMigrationRole = user?.roles?.some((r) => r === 'daita:migration:admin');
    if (hasMigrationRole) {
      next();
    } else {
      res.status(403).json({ message: 'missing daita:migration:admin role' });
    }
  });

  router.get('/:schema/migrations', async (req, res, next) => {
    try {
      const migrations = await ormAdapter.getAppliedMigrations(req.params.schema);
      res.json({ migrations });
    } catch (e) {
      next(e);
    }
  });

  router.post('/:schema/migrations', async (req, res, next) => {
    try {
      if (!req.body.migrationPlan) {
        // TODO extend validation
        return res.status(400).json({ message: 'invalid data' });
      }

      await ormAdapter.applyMigration(req.params.schema, req.body.migrationPlan);
      res.status(200).end();
    } catch (e) {
      next(e);
    }
  });

  return router;
}
