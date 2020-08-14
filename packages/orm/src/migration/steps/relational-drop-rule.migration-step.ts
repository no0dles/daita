import { Rule } from '@daita/relational';

export interface RelationalDropRuleMigrationStep {
  kind: 'drop_rule';
  rule: Rule;
}
