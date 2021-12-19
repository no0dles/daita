import { AuthorizedContext } from './authorized-context';
import { failNever, Resolvable } from '@daita/common';
import { RelationalDataAdapter, RelationalRawResult, RuleContext, RulesEvaluator } from '@daita/relational';
import { MigrationTree } from '../migration';
import { RuleError } from '../error';
import { RelationalBaseContext } from './relational-base-context';

export class RelationalAuthorizedContext extends RelationalBaseContext implements AuthorizedContext<any> {
  private readonly rulesEvaluator: Resolvable<RulesEvaluator>;

  constructor(
    adapter: RelationalDataAdapter<any>,
    migrationTree: Resolvable<MigrationTree>,
    protected auth: RuleContext,
  ) {
    super(adapter, migrationTree);
    this.rulesEvaluator = new Resolvable<RulesEvaluator>(async () => {
      const migrationTree = await this.migrationTree.get();
      const rules = migrationTree.getSchemaDescription().rules || {};
      return new RulesEvaluator(Object.keys(rules).map((id) => ({ id, rule: rules[id] })));
    });
  }

  async exec(sql: any): Promise<RelationalRawResult> {
    const rulesEval = await this.rulesEvaluator.get();
    const result = rulesEval.evaluate(this.auth, sql);
    if (!result) {
      throw new RuleError('no rules');
    } else if (result.type === 'forbid') {
      throw new RuleError('rule forbid', result);
    } else if (result.type === 'allow') {
      if (result.score !== 1) {
        throw new RuleError('no matching allow', result);
      }
    } else {
      // TODO why does this not compile failNever(result, 'unknown result type');
    }
    return super.exec(sql);
  }

  async isAuthorized(sql: any): Promise<boolean> {
    const ruleEvaluator = await this.rulesEvaluator.get();
    const rule = ruleEvaluator.evaluate(this.auth, sql);
    if (!rule) {
      return false;
    }

    if (rule.type === 'forbid') {
      return false;
    } else if (rule.type === 'allow') {
      return rule.errors.length === 0;
    }

    return false;
  }
}
