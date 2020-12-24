import { RuleResult } from '../../relational/permission/validate';

export class RuleError extends Error {
  constructor(message: string, public result?: RuleResult) {
    super(message);
  }
}
