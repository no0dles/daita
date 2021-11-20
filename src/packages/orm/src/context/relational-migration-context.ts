import { RelationalTransactionContext } from './relational-transaction-context';
import { MigrationDirection, RelationalMigrationAdapter } from '../adapter/relational-migration-adapter';
import { MigrationTree } from '../migration/migration-tree';
import { MigrationContext, MigrationContextUpdateOptions } from './get-migration-context';
import { MigrationDescription } from '../migration/migration-description';
import { RuleContext } from '@daita/relational';
import { RelationalTransactionAdapter } from '@daita/relational';
import { SchemaDescription } from '../schema/description/relational-schema-description';
import { getSchemaDescription } from '../schema/relational-schema-description';
import { SchemaMapper } from '../schema/description/schema-mapper';
import { NormalMapper } from '../schema/description/normal-mapper';
import { Resolvable } from '@daita/common';
import { OrmRelationalSchema } from '../schema/orm-relational-schema';

export interface MigrationPlan {
  migration: MigrationDescription;
  direction: MigrationDirection;
  targetSchema: SchemaDescription;
}

export class RelationalMigrationContext extends RelationalTransactionContext implements MigrationContext<any> {
  constructor(
    public migrationAdapter: RelationalMigrationAdapter<any> & RelationalTransactionAdapter<any>,
    migrationTree: Resolvable<MigrationTree>,
    auth: RuleContext | null,
  ) {
    super(migrationAdapter, migrationTree, auth);
  }

  authorize(auth: RuleContext): RelationalTransactionContext {
    return new RelationalMigrationContext(this.migrationAdapter, this.migrationTree, auth);
  }

  forSchema(migrationTree: MigrationTree | OrmRelationalSchema, auth?: RuleContext) {
    if (migrationTree instanceof MigrationTree) {
      return new RelationalMigrationContext(
        this.migrationAdapter,
        new Resolvable<MigrationTree>(migrationTree),
        auth || null,
      );
    } else {
      return new RelationalMigrationContext(
        this.migrationAdapter,
        new Resolvable<MigrationTree>(migrationTree.getMigrations()),
        auth || null,
      );
    }
  }

  async needsMigration(options?: MigrationContextUpdateOptions): Promise<boolean> {
    const updates = await this.getPendingMigrations(options);
    return updates.length > 0;
  }

  async migrate(options?: MigrationContextUpdateOptions): Promise<void> {
    const pendingMigrations = await this.getPendingMigrations(options);
    const migrationTree = await this.migrationTree.get();
    for (const migration of pendingMigrations) {
      await this.migrationAdapter.applyMigration(migrationTree.name, migration);
    }
  }

  private async getPendingMigrations(options?: MigrationContextUpdateOptions): Promise<MigrationPlan[]> {
    const migrationTree = await this.migrationTree.get();
    const appliedMigrations = await this.migrationAdapter.getAppliedMigrations(migrationTree.name);

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
}
