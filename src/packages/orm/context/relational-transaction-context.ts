import { TransactionContext } from './transaction-context';
import { RelationalContext } from './relational-context';
import { RelationalTransactionAdapter } from '../../relational/adapter/relational-transaction-adapter';
import { Client } from '../../relational/client/client';
import { MigrationTree } from '../migration/migration-tree';
import { RuleContext } from '../../relational/permission/description/rule-context';
import { Resolvable } from '../../common/utils/resolvable';

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

  transaction<R>(action: (trx: Client<any>) => Promise<R>): Promise<R> {
    return this.transactionAdapter.transaction<R>(async (adapter) => {
      return await action(new RelationalContext(adapter, this.migrationTree, this.auth));
    });
  }
}
