export interface RuleValidateForbidResult {
  type: 'forbid';
  ruleId?: string;
  error: string;
  path?: string[];
}
