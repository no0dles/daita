import { RuleContext } from '../../relational/permission/description/rule-context';
import { Client } from '../../relational';

export interface Context<T> extends Client<T> {
  authorize(auth: RuleContext): Context<T>;
}
