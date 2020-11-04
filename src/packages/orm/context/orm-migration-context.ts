import { MigrationContext, MigrationContextUpdateOptions } from './get-migration-context';
import { MigrationTree } from '../migration/migration-tree';
import { Client } from '../../relational/client/client';
import { MigrationAdapter, MigrationDirection } from '../migration/migration-adapter';
import { Defer } from '../../common/utils/defer';
import { MigrationDescription } from '../migration/migration-description';

export class OrmMigrationContext implements MigrationContext {
  constructor(private adpater: MigrationAdapter<any>, private migrationTree: MigrationTree) {}

  async needsUpdate(options?: MigrationContextUpdateOptions): Promise<boolean> {
    const updates = await this.pendingMigrations(options);
    return updates.length > 0;
  }

  async pendingMigrations(
    options?: MigrationContextUpdateOptions,
  ): Promise<{ migration: MigrationDescription; direction: MigrationDirection }[]> {
    return this.run((client) => {
      return this.getPendingMigrations(client, options);
    });
  }

  async update(options?: MigrationContextUpdateOptions): Promise<void> {
    await this.run(async (client) => {
      const pendingMigrations = await this.getPendingMigrations(client, options);
      for (const migration of pendingMigrations) {
        await this.adpater.applyMigration(client, this.migrationTree.name, migration.migration, migration.direction);
      }
    });
  }

  private async getPendingMigrations(
    client: Client<any>,
    options?: MigrationContextUpdateOptions,
  ): Promise<{ migration: MigrationDescription; direction: MigrationDirection }[]> {
    const appliedMigrations = await this.adpater.getAppliedMigrations(client, this.migrationTree.name);

    let currentMigrations = this.migrationTree.roots();

    const targetMigrationId = options?.targetMigration;
    if (targetMigrationId) {
      const targetMigration = this.migrationTree.get(targetMigrationId);
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
          return migrationsToRevert.map((migration) => ({ migration, direction: 'reverse' }));
        }
      }
    }

    const pendingMigrations: { migration: MigrationDescription; direction: MigrationDirection }[] = [];
    while (currentMigrations.length > 0) {
      if (currentMigrations.length > 1) {
        throw new Error('multiple possible next migrations');
      }

      const currentMigration = currentMigrations[0];

      if (!appliedMigrations.some((m) => m.id === currentMigration.id)) {
        pendingMigrations.push({ migration: currentMigration, direction: 'forward' });
      }

      if (targetMigrationId && currentMigration.id === targetMigrationId) {
        break;
      }

      currentMigrations = this.migrationTree.next(currentMigration.id);
    }

    return pendingMigrations;
  }

  private async run<T>(fn: (client: Client<any>) => Promise<T>): Promise<T> {
    const defer = new Defer<void>();
    try {
      const client = await this.adpater.getClient(defer.promise);
      const result = await fn(client);
      defer.resolve();
      return result;
    } catch (e) {
      defer.reject(e);
      throw e;
    }
  }

  async close(): Promise<void> {
    await this.adpater.close();
  }
}
