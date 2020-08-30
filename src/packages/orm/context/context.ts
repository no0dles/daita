import {RuleContext} from '../../relational/permission/description';

export interface Context<T> {
  authorize(auth: RuleContext): void;
}
