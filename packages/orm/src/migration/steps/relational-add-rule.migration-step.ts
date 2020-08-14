import { Rule } from '@daita/relational';

export interface RelationalAddRuleMigrationStep {
  kind: 'add_rule';
  rule: Rule;
}
