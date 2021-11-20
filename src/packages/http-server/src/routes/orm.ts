import { HttpServerOptions } from '@daita/http-server-common/http-server-options';
import { Router } from 'express';
import { getRequestUser } from '@daita/http-server-common/get-request-user';

export function ormRoute(options: HttpServerOptions) {
  const router = Router();

  const context = options.relational?.context;
  if (!context) {
    return router;
  }

  router.use((req, res, next) => {
    const hasMigrationRole = getRequestUser(req)?.roles?.some((r) => r === 'daita:migration:admin');
    if (hasMigrationRole) {
      next();
    } else {
      res.status(403).json({ message: 'missing daita:migration:admin role' });
    }
  });

  router.get('/:schema/migrations', async (req, res, next) => {
    try {
      const migrations = await context.migrationAdapter.getAppliedMigrations(req.params.schema);
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

      await context.migrationAdapter.applyMigration(req.params.schema, req.body.migrationPlan);
      res.status(200).end();
    } catch (e) {
      next(e);
    }
  });

  return router;
}
