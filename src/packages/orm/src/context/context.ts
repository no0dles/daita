import { RuleContext } from '@daita/relational/permission/description/rule-context';
import { Client } from '@daita/relational/client/client';

export interface Context<T> extends Client<T> {
  authorize(auth: RuleContext): Context<T>;
}
