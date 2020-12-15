import { Context } from './context';
import { RelationalBaseContext } from './relational-base-context';
import { validateRules } from '../../relational/permission/validate';
import { RelationalRawResult } from '../../relational/adapter/relational-raw-result';
import { RelationalDataAdapter } from '../../relational/adapter/relational-data-adapter';
import { RuleContext } from '../../relational/permission/description/rule-context';
import { MigrationTree } from '../migration/migration-tree';
import { RuleError } from '../error/rule-error';
import { Resolvable } from '../../common/utils/resolvable';

export class RelationalContext extends RelationalBaseContext implements Context<any> {
  constructor(
    adapter: RelationalDataAdapter<any>,
    migrationTree: Resolvable<MigrationTree>,
    protected auth: RuleContext | null,
  ) {
    super(adapter, migrationTree);
  }

  authorize(auth: RuleContext): RelationalContext {
    return new RelationalContext(this.dataAdapter, this.migrationTree, auth);
  }

  async exec(sql: any): Promise<RelationalRawResult> {
    if (!this.auth) {
      return super.exec(sql);
    }

    const result = validateRules(sql, (await this.migrationTree.get()).getSchemaDescription().rulesList, this.auth);
    if (result.type === 'forbid') {
      throw new RuleError(result.error);
    }
    return super.exec(sql);
  }
}
