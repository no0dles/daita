import { RelationalAuthorizedContext } from './relational-authorized-context';
import { AuthorizedTransactionContext } from './transaction-context';
import { RelationalTransactionAdapter, RuleContext } from '@daita/relational';
import { Resolvable } from '@daita/common';
import { MigrationTree } from '../migration';
import { AuthorizedContext } from './authorized-context';

export class RelationalAuthorizedTransactionContext
  extends RelationalAuthorizedContext
  implements AuthorizedTransactionContext<any>
{
  constructor(
    private transactionAdapter: RelationalTransactionAdapter,
    migrationTree: Resolvable<MigrationTree>,
    auth: RuleContext,
  ) {
    super(transactionAdapter, migrationTree, auth);
  }

  transaction<R>(action: (trx: AuthorizedContext<any>) => Promise<R>): Promise<R> {
    return this.transactionAdapter.transaction<R>(async (adapter) => {
      return await action(new RelationalAuthorizedContext(adapter, this.migrationTree, this.auth));
    });
  }
}
