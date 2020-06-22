import { RuleContext } from '@daita/relational';

export interface Context<T> {
  authorize(auth: RuleContext): void;
}
