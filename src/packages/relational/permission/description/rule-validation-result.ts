import { RuleValidateForbidResult } from './rule-validation-forbid-result';
import { RuleValidateNextResult } from './rule-validation-next-result';
import { RuleValidateAllowResult } from './rule-validation-allow-result';

export type RuleValidateResult =
  | RuleValidateNextResult
  | RuleValidateAllowResult
  | RuleValidateForbidResult;
