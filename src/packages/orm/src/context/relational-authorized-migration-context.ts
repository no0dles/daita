import { AuthorizedMigrationContext, MigrationContextUpdateOptions } from './get-migration-context';
import { RelationalMigrationAdapter } from '../adapter';
import { RelationalTransactionAdapter, RuleContext } from '@daita/relational';
import { Resolvable } from '@daita/common';
import { MigrationTree } from '../migration';
import { OrmRelationalSchema } from '../schema';
import { migrate, needsMigration } from './utils';
import { RelationalAuthorizedTransactionContext } from './relational-authorized-transaction-context';

export class RelationalAuthorizedMigrationContext
  extends RelationalAuthorizedTransactionContext
  implements AuthorizedMigrationContext<any>
{
  constructor(
    public migrationAdapter: RelationalMigrationAdapter<any> & RelationalTransactionAdapter<any>,
    migrationTree: Resolvable<MigrationTree>,
    auth: RuleContext,
  ) {
    super(migrationAdapter, migrationTree, auth);
  }

  isAuthorized(sql: any): Promise<boolean> {
    return Promise.resolve(false);
  }

  forSchema(migrationTree: MigrationTree | OrmRelationalSchema): AuthorizedMigrationContext<any> {
    if (migrationTree instanceof MigrationTree) {
      return new RelationalAuthorizedMigrationContext(
        this.migrationAdapter,
        new Resolvable<MigrationTree>(migrationTree),
        this.auth,
      );
    } else {
      return new RelationalAuthorizedMigrationContext(
        this.migrationAdapter,
        new Resolvable<MigrationTree>(migrationTree.getMigrations()),
        this.auth,
      );
    }
  }

  async remove(): Promise<void> {
    await this.migrationAdapter.remove();
  }

  async needsMigration(options?: MigrationContextUpdateOptions): Promise<boolean> {
    return needsMigration(this.migrationAdapter, this.migrationTree, options);
  }

  async migrate(options?: MigrationContextUpdateOptions): Promise<void> {
    return migrate(this.migrationAdapter, this.migrationTree);
  }
}
