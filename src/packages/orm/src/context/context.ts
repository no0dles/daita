import { RuleContext } from '@daita/relational';
import { Client } from '@daita/relational';

export interface Context<T> extends Client<T> {
  authorize(auth: RuleContext): Context<T>;
}
