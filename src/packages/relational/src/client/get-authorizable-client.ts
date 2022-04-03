import { Rule, RuleContext, RulesEvaluator } from '../permission';
import {
  BaseRelationalTransactionAdapter,
  RelationalAdapter,
  RelationalAuthorizableAdapter,
  RelationalAuthorizedAdapter,
  RelationalRawResult,
  RelationalTransactionAdapter,
} from '../adapter';
import { BaseRelationalAdapter } from '../adapter/base-relational-adapter';
import { DeleteSql, InsertSql, UpdateSql } from '../sql';

export interface AuthorizableClientOptions {
  rules: { id: string; rule: Rule }[];
}

export function authorizable<TQuery extends InsertSql<any> | UpdateSql<any> | DeleteSql>(
  adapter: RelationalAdapter<TQuery>,
  options: AuthorizableClientOptions,
): RelationalAuthorizableAdapter<TQuery> {
  const ruleEvaluator = new RulesEvaluator(options.rules);
  return {
    authorize(context: RuleContext): RelationalAuthorizedAdapter<TQuery> {
      return new AuthorizedAdapter(adapter, context, () => Promise.resolve(ruleEvaluator));
    },
  };
}

export class AuthorizedTransactionAdapter<T extends InsertSql<any> | UpdateSql<any> | DeleteSql>
  extends BaseRelationalTransactionAdapter
  implements RelationalTransactionAdapter<T>
{
  constructor(
    private adapter: RelationalTransactionAdapter<T>,
    private context: RuleContext,
    private rulesEvaluator: RulesEvaluator,
  ) {
    super();
  }

  exec(sql: T): void {
    this.rulesEvaluator.checkForAuthorization(this.context, sql);
    this.adapter.exec(sql);
  }

  execRaw(sql: string, values: any[]): void {
    this.rulesEvaluator.checkForAuthorization(this.context, sql);
    return this.adapter.execRaw(sql, values);
  }

  supportsQuery<S>(sql: S): this is RelationalAdapter<T | S> {
    return this.adapter.supportsQuery(sql);
  }
}

export class AuthorizedAdapter<T extends InsertSql<any> | UpdateSql<any> | DeleteSql>
  extends BaseRelationalAdapter
  implements RelationalAuthorizedAdapter<T>
{
  constructor(
    private adapter: RelationalAdapter<T>,
    private context: RuleContext,
    private ruleEvaluator: () => Promise<RulesEvaluator>,
  ) {
    super();
  }

  close(): Promise<void> {
    return this.adapter.close();
  }

  async exec(sql: any): Promise<RelationalRawResult> {
    const rulesEvaluator = await this.ruleEvaluator();
    rulesEvaluator.checkForAuthorization(this.context, sql);
    return this.adapter.exec(sql);
  }

  async execRaw(sql: string, values: any[]): Promise<RelationalRawResult> {
    const rulesEvaluator = await this.ruleEvaluator();
    rulesEvaluator.checkForAuthorization(this.context, sql);
    return this.adapter.execRaw(sql, values);
  }

  async isAuthorized(sql: any): Promise<boolean> {
    const rulesEvaluator = await this.ruleEvaluator();
    return rulesEvaluator.isAuthorized(this.context, sql);
  }

  supportsQuery<S>(sql: S): this is RelationalAdapter<T | S> {
    return this.adapter.supportsQuery(sql);
  }

  async transaction(action: (adapter: RelationalTransactionAdapter<T>) => void): Promise<void> {
    const rulesEvaluator = await this.ruleEvaluator();
    return this.adapter.transaction((adapter) => {
      return action(new AuthorizedTransactionAdapter<T>(adapter, this.context, rulesEvaluator));
    });
  }
}
