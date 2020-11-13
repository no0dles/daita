import { RelationalTransactionContext } from './relational-transaction-context';
import { MigrationDirection, RelationalMigrationAdapter } from '../adapter/relational-migration-adapter';
import { Client, RelationalTransactionAdapter } from '../../relational';
import { MigrationTree } from '../migration/migration-tree';
import { MigrationContext, MigrationContextUpdateOptions } from './get-migration-context';
import { MigrationDescription } from '../migration/migration-description';
import { Defer } from '../../common';
import { RuleContext } from '../../relational/permission/description/rule-context';

export class RelationalMigrationContext extends RelationalTransactionContext implements MigrationContext<any> {
  constructor(
    private migrationAdapter: RelationalMigrationAdapter<any> & RelationalTransactionAdapter<any>,
    migrationTree: MigrationTree,
    auth: RuleContext,
  ) {
    super(migrationAdapter, migrationTree, auth);
  }

  authorize(auth: RuleContext): RelationalTransactionContext {
    return new RelationalMigrationContext(this.migrationAdapter, this.migrationTree, auth);
  }

  async needsMigration(options?: MigrationContextUpdateOptions): Promise<boolean> {
    const updates = await this.pendingMigrations(options);
    return updates.length > 0;
  }

  private async pendingMigrations(
    options?: MigrationContextUpdateOptions,
  ): Promise<{ migration: MigrationDescription; direction: MigrationDirection }[]> {
    return this.run((client) => {
      return this.getPendingMigrations(client, options);
    });
  }

  async migrate(options?: MigrationContextUpdateOptions): Promise<void> {
    await this.run(async (client) => {
      const pendingMigrations = await this.getPendingMigrations(client, options);
      for (const migration of pendingMigrations) {
        await this.migrationAdapter.applyMigration(
          client,
          this.migrationTree.name,
          migration.migration,
          migration.direction,
        );
      }
    });
  }

  private async getPendingMigrations(
    client: Client<any>,
    options?: MigrationContextUpdateOptions,
  ): Promise<{ migration: MigrationDescription; direction: MigrationDirection }[]> {
    const appliedMigrations = await this.migrationAdapter.getAppliedMigrations(client, this.migrationTree.name);

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
      const client = await this.migrationAdapter.getClient(defer.promise);
      const result = await fn(client);
      defer.resolve();
      return result;
    } catch (e) {
      defer.reject(e);
      throw e;
    }
  }
}
