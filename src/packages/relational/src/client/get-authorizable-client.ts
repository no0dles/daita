import { Rule, RuleContext, RulesEvaluator } from '../permission';
import {
  RelationalAdapter,
  RelationalAuthorizableAdapter,
  RelationalAuthorizedAdapter,
  RelationalRawResult,
  RelationalTransactionAdapter,
} from '../adapter';
import { BaseRelationalAdapter } from '../adapter/base-relational-adapter';

export interface AuthorizableClientOptions {
  rules: { id: string; rule: Rule }[];
}

export function authorizable<TQuery>(
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

export class AuthorizedTransactionAdapter<T> extends BaseRelationalAdapter implements RelationalTransactionAdapter<T> {
  constructor(
    private adapter: RelationalTransactionAdapter<T>,
    private context: RuleContext,
    private ruleEvaluator: () => Promise<RulesEvaluator>,
  ) {
    super();
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

  supportsQuery<S>(sql: S): this is RelationalAdapter<T | S> {
    return this.adapter.supportsQuery(sql);
  }
}

export class AuthorizedAdapter<T> extends BaseRelationalAdapter implements RelationalAuthorizedAdapter<T> {
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

  transaction<R>(action: (adapter: RelationalTransactionAdapter<T>) => Promise<R>, timeout?: number): Promise<R> {
    return this.adapter.transaction<R>((adapter) => {
      return action(new AuthorizedTransactionAdapter<T>(adapter, this.context, this.ruleEvaluator));
    }, timeout);
  }
}
