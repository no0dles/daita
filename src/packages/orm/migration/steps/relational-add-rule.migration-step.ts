import { Rule } from '../../../relational/permission/description';

export interface RelationalAddRuleMigrationStep {
  kind: 'add_rule';
  rule: Rule;
  ruleId: string;
}
