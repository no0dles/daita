import { RuleResult } from '@daita/relational';

export class RuleError extends Error {
  constructor(message: string, public result?: RuleResult) {
    super(message);
  }
}
