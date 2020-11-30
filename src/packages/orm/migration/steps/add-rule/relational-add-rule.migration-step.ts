import { Rule } from '../../../../relational/permission/description/rule';

export interface RelationalAddRuleMigrationStep {
  kind: 'add_rule';
  rule: Rule;
  ruleId: string;
}
