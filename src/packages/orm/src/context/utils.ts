import { RelationalMigrationAdapter } from '../adapter';
import { Resolvable } from '@daita/common';
import { MigrationDescription, MigrationTree } from '../migration';
import { MigrationContextUpdateOptions } from './get-migration-context';
import { getSchemaDescription, NormalMapper, SchemaMapper } from '../schema';
import { MigrationPlan } from './migration-plan';

export async function needsMigration(
  migrationAdapter: RelationalMigrationAdapter<any>,
  migrationTreeResolvable: Resolvable<MigrationTree>,
  options?: MigrationContextUpdateOptions,
): Promise<boolean> {
  const updates = await getPendingMigrations(migrationAdapter, migrationTreeResolvable, options);
  return updates.length > 0;
}

export async function getPendingMigrations(
  migrationAdapter: RelationalMigrationAdapter<any>,
  migrationTreeResolvable: Resolvable<MigrationTree>,
  options?: MigrationContextUpdateOptions,
): Promise<MigrationPlan[]> {
  const migrationTree = await migrationTreeResolvable.get();
  const appliedMigrations = await migrationAdapter.getAppliedMigrations(migrationTree.name);

  let currentMigrations = migrationTree.roots();

  const targetMigrationId = options?.targetMigration;
  if (targetMigrationId) {
    const targetMigration = migrationTree.get(targetMigrationId);
    if (!targetMigration) {
      throw new Error('unable to find target migration ' + targetMigrationId);
    }
    const appliedTargetMigration = appliedMigrations.find((m) => m.id === targetMigrationId);
    if (appliedTargetMigration) {
      const index = appliedMigrations.indexOf(appliedTargetMigration);
      const migrationsToRevert = appliedMigrations.slice(index);
      if (migrationsToRevert.length === 0) {
        return [];
      } else {
        // TODO ordering of migrations
        // TODO create target schema
        return migrationsToRevert.map((migration) => ({
          migration,
          direction: 'reverse',
          targetSchema: null as any,
        }));
      }
    }
  }

  const pendingMigrations: MigrationPlan[] = [];
  const migrations: MigrationDescription[] = [];
  while (currentMigrations.length > 0) {
    if (currentMigrations.length > 1) {
      throw new Error('multiple possible next migrations');
    }

    const currentMigration = currentMigrations[0];
    migrations.push(currentMigration);
    if (!appliedMigrations.some((m) => m.id === currentMigration.id)) {
      const schema = getSchemaDescription(migrationTree.name, new SchemaMapper(() => new NormalMapper()), migrations);
      pendingMigrations.push({ migration: currentMigration, direction: 'forward', targetSchema: schema });
    }

    if (targetMigrationId && currentMigration.id === targetMigrationId) {
      break;
    }

    currentMigrations = migrationTree.next(currentMigration.id);
  }

  return pendingMigrations;
}

export async function migrate(
  migrationAdapter: RelationalMigrationAdapter<any>,
  migrationTreeResolvable: Resolvable<MigrationTree>,
  options?: MigrationContextUpdateOptions,
) {
  const pendingMigrations = await getPendingMigrations(migrationAdapter, migrationTreeResolvable, options);
  const migrationTree = await migrationTreeResolvable.get();
  for (const migration of pendingMigrations) {
    await migrationAdapter.applyMigration(migrationTree.name, migration);
  }
}
