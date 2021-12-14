import { RelationalTransactionContext } from './relational-transaction-context';
import { RelationalMigrationAdapter } from '../adapter/relational-migration-adapter';
import { MigrationTree } from '../migration/migration-tree';
import { AuthorizedMigrationContext, MigrationContext, MigrationContextUpdateOptions } from './get-migration-context';
import { RuleContext } from '@daita/relational';
import { RelationalTransactionAdapter } from '@daita/relational';
import { Resolvable } from '@daita/common';
import { OrmRelationalSchema } from '../schema/orm-relational-schema';
import { RelationalAuthorizedMigrationContext } from './relational-authorized-migration-context';
import { migrate, needsMigration } from './utils';

export class RelationalMigrationContext extends RelationalTransactionContext implements MigrationContext<any> {
  constructor(
    public migrationAdapter: RelationalMigrationAdapter<any> & RelationalTransactionAdapter<any>,
    migrationTree: Resolvable<MigrationTree>,
  ) {
    super(migrationAdapter, migrationTree);
  }

  authorize(auth: RuleContext<any>): AuthorizedMigrationContext<any> {
    return new RelationalAuthorizedMigrationContext(this.migrationAdapter, this.migrationTree, auth);
  }

  forSchema(migrationTree: MigrationTree | OrmRelationalSchema): MigrationContext<any> {
    if (migrationTree instanceof MigrationTree) {
      return new RelationalMigrationContext(this.migrationAdapter, new Resolvable<MigrationTree>(migrationTree));
    } else {
      return new RelationalMigrationContext(
        this.migrationAdapter,
        new Resolvable<MigrationTree>(migrationTree.getMigrations()),
      );
    }
  }

  migrate(options?: MigrationContextUpdateOptions): Promise<void> {
    return migrate(this.migrationAdapter, this.migrationTree);
  }

  needsMigration(options?: MigrationContextUpdateOptions): Promise<boolean> {
    return needsMigration(this.migrationAdapter, this.migrationTree, options);
  }

  async remove(): Promise<void> {
    await this.migrationAdapter.remove();
  }
}
