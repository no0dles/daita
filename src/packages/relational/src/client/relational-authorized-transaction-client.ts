import { AuthorizedTransactionClient } from './transaction-client';
import { RelationalTransactionAdapter } from '../adapter';
import { RuleContext, RulesEvaluator } from '../permission';
import { RelationalAuthorizedClient } from './relational-authorized-client';
import { AuthorizedClient } from './client';

export class RelationalAuthorizedTransactionClient
  extends RelationalAuthorizedClient
  implements AuthorizedTransactionClient<any>
{
  constructor(
    private transactionAdapter: RelationalTransactionAdapter,
    ruleEvaluator: RulesEvaluator,
    auth: RuleContext,
  ) {
    super(transactionAdapter, ruleEvaluator, auth);
  }

  transaction<R>(action: (trx: AuthorizedClient<any>) => Promise<R>): Promise<R> {
    return this.transactionAdapter.transaction<R>(async (adapter) => {
      return action(new RelationalAuthorizedClient(adapter, this.ruleEvaluator, this.auth));
    });
  }

  async close(): Promise<void> {
    await this.transactionAdapter.close();
  }
}
