import { RelationalOrmAdapter } from '../adapter';
import { MigrationDescription, MigrationTree } from '../migration';
import { emptySchema, getSchemaDescription, NormalMapper, SchemaMapper } from '../schema';
import { MigrationPlan } from './migration-plan';
import { MigrationContextUpdateOptions } from './migration-context-update-options';

export async function needsMigration(
  migrationAdapter: RelationalOrmAdapter,
  migrationTree: MigrationTree,
  options?: MigrationContextUpdateOptions,
): Promise<boolean> {
  const updates = await getPendingMigrations(migrationAdapter, migrationTree, options);
  return updates.length > 0;
}

export async function getPendingMigrations(
  migrationAdapter: RelationalOrmAdapter,
  migrationTree: MigrationTree,
  options?: MigrationContextUpdateOptions,
): Promise<MigrationPlan[]> {
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
          steps: [], // TODO
        }));
      }
    }
  }

  const pendingMigrations: MigrationPlan[] = [];
  const migrations: MigrationDescription[] = [];
  let schema = emptySchema(migrationTree.name);
  while (currentMigrations.length > 0) {
    if (currentMigrations.length > 1) {
      throw new Error('multiple possible next migrations');
    }

    const currentMigration = currentMigrations[0];
    migrations.push(currentMigration);
    if (!appliedMigrations.some((m) => m.id === currentMigration.id)) {
      const description = getSchemaDescription(schema, new SchemaMapper(() => new NormalMapper()), [currentMigration]);
      pendingMigrations.push({
        migration: currentMigration,
        direction: 'forward',
        targetSchema: description.schema,
        steps: description.steps,
      });
      schema = description.schema;
    } else {
      schema = getSchemaDescription(schema, new SchemaMapper(() => new NormalMapper()), [currentMigration]).schema;
    }

    if (targetMigrationId && currentMigration.id === targetMigrationId) {
      break;
    }

    currentMigrations = migrationTree.next(currentMigration.id);
  }

  return pendingMigrations;
}

export async function doMigrate(
  migrationAdapter: RelationalOrmAdapter,
  migrationTree: MigrationTree,
  options?: MigrationContextUpdateOptions,
) {
  const pendingMigrations = await getPendingMigrations(migrationAdapter, migrationTree, options);
  for (const migration of pendingMigrations) {
    await migrationAdapter.applyMigration(migrationTree.name, migration);
  }
}
