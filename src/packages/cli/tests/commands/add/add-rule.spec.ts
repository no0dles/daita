import { getMigrationSteps } from '../../utils.test';
import { User } from './add-view.test';
import {allow, authorized} from '../../../../relational/permission/function';
import {field, table} from '../../../../relational/sql/function';
import {getRuleId, MigrationStep} from '../../../../orm/migration';

describe('add-rule', () => {
  let steps: MigrationStep[] = [];

  beforeAll(async () => {
    steps = await getMigrationSteps(__dirname + '/add-rule.test.ts');
  });

  it('should add table', () => {
    expect(steps).toIncludeAnyMembers([{
      kind: 'add_table', table: 'User',
    }]);
  });

  it('should add rule', () => {
    const addRuleStep = steps.find(s => s.kind === 'add_rule');
    const rule = allow(authorized(), {
      select: field(User, 'id'),
      from: table(User),
    });
    expect(addRuleStep).toEqual({
      kind: 'add_rule',
      rule: rule,
      ruleId: getRuleId(rule),
    });
  });
});
