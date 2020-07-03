import { Context } from './context';
import { RelationalBaseContext } from './relational-base-context';
import { RelationalDataAdapter, RelationalRawResult, RuleContext, validateRules } from '@daita/relational';
import { OrmRelationalSchema } from '../schema';

export class RelationalContext extends RelationalBaseContext implements Context<any> {
  auth: RuleContext = { isAuthorized: false };

  constructor(adapter: RelationalDataAdapter<any>,
              schema: OrmRelationalSchema) {
    super(adapter, schema);
  }

  authorize(auth: RuleContext): void {
    this.auth = auth;
  }

  exec(sql: any): Promise<RelationalRawResult> {
    const result = validateRules(sql, this.schema.getRules(), this.auth);
    if (result.type === 'forbid') {
      throw new Error(result.error);
    }
    return super.exec(sql);
  }
}
