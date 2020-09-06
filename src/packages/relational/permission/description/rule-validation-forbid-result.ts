export interface RuleValidateForbidResult {
  type: 'forbid';
  error: string;
  details: { message: string; ruleId: string }[];
}
