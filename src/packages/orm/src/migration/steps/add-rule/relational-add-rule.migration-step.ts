import { Rule } from '@daita/relational/permission/description/rule';

export interface RelationalAddRuleMigrationStep {
  kind: 'add_rule';
  rule: Rule;
  ruleId: string;
}
