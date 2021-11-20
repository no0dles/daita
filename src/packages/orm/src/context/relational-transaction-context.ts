import { TransactionContext } from './transaction-context';
import { RelationalContext } from './relational-context';
import { RelationalTransactionAdapter } from '@daita/relational/adapter/relational-transaction-adapter';
import { Client } from '@daita/relational/client/client';
import { MigrationTree } from '../migration/migration-tree';
import { RuleContext } from '@daita/relational/permission/description/rule-context';
import { Resolvable } from '@daita/common/utils/resolvable';
import { Context } from './context';

export class RelationalTransactionContext extends RelationalContext implements TransactionContext<any> {
  constructor(
    protected transactionAdapter: RelationalTransactionAdapter<any>,
    migrationTree: Resolvable<MigrationTree>,
    auth: RuleContext | null,
  ) {
    super(transactionAdapter, migrationTree, auth);
  }

  authorize(auth: RuleContext): RelationalTransactionContext {
    return new RelationalTransactionContext(this.transactionAdapter, this.migrationTree, auth);
  }

  transaction<R>(action: (trx: Context<any>) => Promise<R>): Promise<R> {
    return this.transactionAdapter.transaction<R>(async (adapter) => {
      return await action(new RelationalContext(adapter, this.migrationTree, this.auth));
    });
  }
}
