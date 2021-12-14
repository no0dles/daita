import { AuthorizableTransactionClient, AuthorizedTransactionClient } from './transaction-client';
import { Rule, RuleContext, RulesEvaluator } from '../permission';
import { RelationalTransactionAdapter } from '../adapter';
import { RelationalAuthorizedTransactionClient } from './relational-authorized-transaction-client';

export class RelationalAuthorizableTransactionClient implements AuthorizableTransactionClient<any> {
  private readonly ruleEvaluator: RulesEvaluator;

  constructor(private dataAdapter: RelationalTransactionAdapter, private rules: { id: string; rule: Rule }[]) {
    this.ruleEvaluator = new RulesEvaluator(this.rules);
  }

  authorize(auth: RuleContext): AuthorizedTransactionClient<any> {
    return new RelationalAuthorizedTransactionClient(this.dataAdapter, this.ruleEvaluator, auth);
  }
}
