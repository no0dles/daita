import { MigrationExecution, MigrationStorage, MigrationTree } from '../migration';
import { MigrationContextUpdateOptions } from './migration-context-update-options';

export async function needsMigration<TSql>(
  migrationStorage: MigrationStorage<TSql>,
  migrationTree: MigrationTree<TSql>,
  options: MigrationContextUpdateOptions,
): Promise<boolean> {
  const updates = await getPendingMigrations(migrationStorage, migrationTree, options);
  return updates.length > 0;
}

export async function getPendingMigrations<TSql>(
  migrationStorage: MigrationStorage<TSql>,
  migrationTree: MigrationTree<TSql>,
  options: MigrationContextUpdateOptions,
): Promise<MigrationExecution<TSql>[]> {
  const currentMigrationTree = await migrationStorage.get(migrationTree.name);

  let currentMigrations = migrationTree.roots();

  const targetMigrationId = options?.targetMigration;
  if (targetMigrationId) {
    const targetMigration = migrationTree.get(targetMigrationId);
    if (!targetMigration) {
      throw new Error('unable to find target migration ' + targetMigrationId);
    }
    const appliedTargetMigration = currentMigrationTree.get(targetMigrationId);
    if (appliedTargetMigration) {
      if (!appliedTargetMigration.after) {
        // current and last migration
        return [];
      } else {
        const migrationToRevert = currentMigrationTree.path(appliedTargetMigration.after);
        return migrationToRevert.reverse().map((m) => ({
          migration: m,
          schema: migrationTree.name,
          direction: 'down',
        }));
      }
    }
  }

  const pendingMigrations: MigrationExecution<TSql>[] = [];
  while (currentMigrations.length > 0) {
    if (currentMigrations.length > 1) {
      throw new Error('multiple possible next migrations');
    }

    const currentMigration = currentMigrations[0];
    if (!currentMigrationTree.get(currentMigration.id)) {
      pendingMigrations.push({
        migration: currentMigration,
        direction: 'up',
        schema: migrationTree.name,
      });
    }

    if (targetMigrationId && currentMigration.id === targetMigrationId) {
      break;
    }

    currentMigrations = migrationTree.next(currentMigration.id);
  }

  return pendingMigrations;
}

export async function doMigrate<TSql>(
  migrationStorage: MigrationStorage<TSql>,
  migrationTree: MigrationTree<TSql>,
  options: MigrationContextUpdateOptions,
) {
  const pendingMigrations = await getPendingMigrations(migrationStorage, migrationTree, options);
  for (const migration of pendingMigrations) {
    await migrationStorage.apply(migration);
  }
}
