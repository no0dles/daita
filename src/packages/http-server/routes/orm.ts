import { AppOptions } from '../../http-server-common/app-options';
import { Router } from 'express';

export function ormRoute(options: AppOptions) {
  const router = Router();

  router.use((req, res, next) => {
    const hasMigrationRole = req.user?.roles?.some((r) => r === 'daita:migration:admin');
    if (hasMigrationRole) {
      next();
    } else {
      res.status(403).json({ message: 'missing daita:migration:admin role' });
    }
  });

  router.get('/:schema/migrations', async (req, res, next) => {
    try {
      const migrations = await options.context.migrationAdapter.getAppliedMigrations(req.params.schema);
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

      await options.context.migrationAdapter.applyMigration(req.params.schema, req.body.migrationPlan);
      res.status(200).end();
    } catch (e) {
      next(e);
    }
  });

  return router;
}
