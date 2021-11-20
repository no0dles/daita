import { Context } from './context';
import { RelationalBaseContext } from './relational-base-context';
import { RelationalRawResult } from '@daita/relational/adapter/relational-raw-result';
import { RelationalDataAdapter } from '@daita/relational/adapter/relational-data-adapter';
import { RuleContext } from '@daita/relational/permission/description/rule-context';
import { MigrationTree } from '../migration/migration-tree';
import { RuleError } from '../error/rule-error';
import { Resolvable } from '@daita/common/utils/resolvable';
import { RulesEvaluator } from '@daita/relational/permission/validate';

export class RelationalContext extends RelationalBaseContext implements Context<any> {
  private readonly rulesEvaluator: Resolvable<RulesEvaluator>;
  constructor(
    adapter: RelationalDataAdapter<any>,
    migrationTree: Resolvable<MigrationTree>,
    protected auth: RuleContext | null,
  ) {
    super(adapter, migrationTree);
    this.rulesEvaluator = new Resolvable<RulesEvaluator>(async () => {
      const migrationTree = await this.migrationTree.get();
      const rules = migrationTree.getSchemaDescription().rules || {};
      return new RulesEvaluator(Object.keys(rules).map((id) => ({ id, rule: rules[id] })));
    });
  }

  authorize(auth: RuleContext): RelationalContext {
    return new RelationalContext(this.dataAdapter, this.migrationTree, auth);
  }

  async exec(sql: any): Promise<RelationalRawResult> {
    if (!this.auth) {
      return super.exec(sql);
    }

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
}
