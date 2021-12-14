import { AuthorizableClient, AuthorizedClient } from './client';
import { Rule, RuleContext, RulesEvaluator } from '../permission';
import { RelationalDataAdapter } from '../adapter';
import { RelationalAuthorizedClient } from './relational-authorized-client';

export class RelationalAuthorizableClient implements AuthorizableClient<any> {
  private readonly ruleEvaluator: RulesEvaluator;

  constructor(private dataAdapter: RelationalDataAdapter, private rules: { id: string; rule: Rule }[]) {
    this.ruleEvaluator = new RulesEvaluator(this.rules);
  }

  authorize(auth: RuleContext): AuthorizedClient<any> {
    return new RelationalAuthorizedClient(this.dataAdapter, this.ruleEvaluator, auth);
  }
}
