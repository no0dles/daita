import { RuleContext } from '../../relational/permission/description/rule-context';

export interface Context<T> {
  authorize(auth: RuleContext): void;
}
