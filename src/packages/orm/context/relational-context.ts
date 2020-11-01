import { Context } from './context';
import { RelationalBaseContext } from './relational-base-context';
import { validateRules } from '../../relational/permission/validate';
import { OrmRelationalSchema } from '../schema/orm-relational-schema';
import { RelationalRawResult } from '../../relational/adapter/relational-raw-result';
import { RelationalDataAdapter } from '../../relational/adapter/relational-data-adapter';
import { RuleContext } from '../../relational/permission/description/rule-context';

export class RelationalContext extends RelationalBaseContext implements Context<any> {
  auth: RuleContext = { isAuthorized: false };

  constructor(adapter: RelationalDataAdapter<any>, schema: OrmRelationalSchema) {
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
