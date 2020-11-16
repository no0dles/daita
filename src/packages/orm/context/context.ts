import { RuleContext } from '../../relational/permission/description/rule-context';
import { Client } from '../../relational/client/client';

export interface Context<T> extends Client<T> {
  authorize(auth: RuleContext): Context<T>;
}
