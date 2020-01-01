import {RelationalDataAdapter} from '../adapter/relational-data-adapter';
import {MigrationSchema} from '../schema/migration-schema';
import {getMigrationSchema} from '../schema/migration-schema-builder';
import {RelationalTransactionContext} from './relational-transaction-context';
import {MigrationTree} from '../migration/migration-tree';
import {MigrationExecution} from '../migration';

export class RelationalContext extends RelationalTransactionContext {
  constructor(
    schema: MigrationSchema,
    private migrationTree: MigrationTree,
    private rootDataAdapter: RelationalDataAdapter,
  ) {
    super(schema, rootDataAdapter as any);
  }

  async transaction(
    action: (trx: RelationalTransactionContext) => Promise<any>,
  ) {
    await this.rootDataAdapter.transaction(async adapter => {
      await action(new RelationalTransactionContext(this.schema, adapter));
    });
  }

  migration() {
    return {
      apply: async () => {
        const exec = new MigrationExecution();

        await exec.init(this.rootDataAdapter);

        let currentMigrations = this.migrationTree.roots();
        while (currentMigrations.length > 0) {
          if (currentMigrations.length > 1) {
            throw new Error('multiple possible next migrations');
          }

          const currentMigration = currentMigrations[0];
          if (!(await exec.exists(currentMigration.id, this.rootDataAdapter))) {
            const migrationPath = this.migrationTree.path(
              currentMigration.id,
            );
            const migrationSchema = getMigrationSchema(migrationPath);
            await exec.apply(currentMigration, migrationSchema, this.rootDataAdapter);
          }

          currentMigrations = this.migrationTree.next(
            currentMigration.id,
          );
        }
      },
    };
  }
}
