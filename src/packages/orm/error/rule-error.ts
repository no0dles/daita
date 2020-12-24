import { RuleResult } from '../../relational/permission/validate';

export class RuleError extends Error {
  constructor(message: string, result?: RuleResult) {
    super(message);
  }
}
