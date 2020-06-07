import { Context } from './context';
import { ContextAuthorization } from './context-authorization';
import { RelationalBaseContext } from './relational-base-context';
import { RelationalDataAdapter, RelationalRawResult } from '@daita/relational';
import { RelationalSchema } from '../schema';
import { ContextValidator, RuleValidator } from '../permission';

export class RelationalContext extends RelationalBaseContext implements Context<any> {
  protected ruleValidator: RuleValidator;

  auth: ContextAuthorization = { isAnonymous: true };

  constructor(adapter: RelationalDataAdapter<any>,
              schema: RelationalSchema) {
    super(adapter, schema);
    this.ruleValidator = new ContextValidator(this.auth, schema.getRules());
  }

  authorize(auth: ContextAuthorization): void {
    this.auth = auth;
    this.ruleValidator = new ContextValidator(this.auth, this.schema.getRules());
  }

  exec(sql: any): Promise<RelationalRawResult> {
    const error = this.ruleValidator.getAuthorizationError(sql);
    if (!error) {
      throw error;
    }
    return super.exec(sql);
  }
}
