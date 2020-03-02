import {RelationalDataAdapter} from '../adapter/relational-data-adapter';
import {MigrationSchema} from '../schema/migration-schema';
import {getMigrationSchema} from '../schema/migration-schema-builder';
import {MigrationTree} from '../migration/migration-tree';
import {MigrationExecution} from '../migration';
import {ContextUser} from '../auth';
import {TableInformation} from './table-information';
import {RelationalInsertContext} from './relational-insert-context';
import {DefaultConstructable} from '../constructable';
import {RelationalSelectContext} from './relational-select-context';
import {RelationalUpdateContext} from './relational-update-context';
import {RelationalDeleteContext} from './relational-delete-context';
import {RelationalMigrationAdapter} from '../adapter/relational-migration-adapter';
import {RelationalTransactionAdapter} from '../adapter';
import {RelationalTransactionContext} from './relational-transaction-context';
import {RelationalDataContext} from './relational-data-context';
import {RelationalMigrationContext} from './relational-migration-context';

export class RelationalContext implements RelationalMigrationContext, RelationalTransactionContext, RelationalDataContext {
  constructor(private relationalAdapter: RelationalMigrationAdapter | RelationalTransactionAdapter | RelationalDataAdapter,
              private schema: MigrationSchema,
              private migrationTree: MigrationTree,
              private user: ContextUser | null) {
  }

  async applyMigrations() {
    const exec = new MigrationExecution();
    const migrationAdapter = this.getMigrationAdapter();

    //TODO warn if things are not migrated

    await exec.init(migrationAdapter);

    let currentMigrations = this.migrationTree.roots();
    while (currentMigrations.length > 0) {
      if (currentMigrations.length > 1) {
        throw new Error('multiple possible next migrations');
      }

      const currentMigration = currentMigrations[0];
      if (!(await exec.exists(currentMigration.id, migrationAdapter))) {
        const migrationPath = this.migrationTree.path(currentMigration.id);
        const migrationSchema = getMigrationSchema(migrationPath);
        await exec.apply(
          currentMigration,
          migrationSchema,
          migrationAdapter,
        );
      }

      currentMigrations = this.migrationTree.next(currentMigration.id);
    }
  }

  insert<T>(type: TableInformation<T>): RelationalInsertContext<T> {
    return new RelationalInsertContext<T>(
      this.getDataAdapter(),
      this.schema,
      type,
      [],
      this.user,
    );
  }

  select<T>(type: DefaultConstructable<T>): RelationalSelectContext<T> {
    return new RelationalSelectContext<T>(
      this.getDataAdapter(), this.schema, type, {
        orderBy: [],
        filter: null,
        limit: null,
        include: [],
        skip: null,
      }, this.user);
  }

  update<T>(type: TableInformation<T>): RelationalUpdateContext<T> {
    return new RelationalUpdateContext<T>(
      this.getDataAdapter(),
      this.schema,
      type,
      {},
      null,
      this.user,
    );
  }

  delete<T>(type: TableInformation<T>): RelationalDeleteContext<T> {
    return new RelationalDeleteContext<T>(
      this.getDataAdapter(),
      this.schema,
      type,
      null,
      this.user,
    );
  }

  raw(query: string, values?: any[]): any {
    return this.getDataAdapter().raw(query, values || []);
  }

  async transaction<T>(action: (trx: RelationalDataContext) => Promise<T>): Promise<T> {
    return await this.getTransactionAdapter().transaction<T>(async adapter => {
      return await action(new RelationalContext(adapter, this.schema, this.migrationTree, this.user));
    });
  }

  private getDataAdapter(): RelationalDataAdapter {
    if (!this.relationalAdapter.isKind('data')) {
      throw new Error('relational adapter is not a data adapter');
    }
    return <RelationalDataAdapter>this.relationalAdapter;
  }

  private getTransactionAdapter(): RelationalTransactionAdapter {
    if (!this.relationalAdapter.isKind('transaction')) {
      throw new Error('relational adapter is not a transaction adapter');
    }
    return <RelationalTransactionAdapter>this.relationalAdapter;
  }

  private getMigrationAdapter(): RelationalMigrationAdapter {
    if (!this.relationalAdapter.isKind('transaction')) {
      throw new Error('relational adapter is not a migration adapter');
    }
    return <RelationalMigrationAdapter>this.relationalAdapter;
  }
}