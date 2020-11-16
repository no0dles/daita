import { getMigrationSteps } from '../../../../../testing/cli/utils.test';
import { User } from './add-view.test';
import { allow } from '../../../../relational/permission/function/allow';
import { field } from '../../../../relational/sql/keyword/field/field';
import { authorized } from '../../../../relational/permission/function/authorized';
import { MigrationStep } from '../../migration-step';
import { table } from '../../../../relational/sql/keyword/table/table';
import { getRuleId } from '../../../../relational/permission/rule-id';

describe('cli/cmds/add/add-rule', () => {
  let steps: MigrationStep[] = [];

  beforeAll(async () => {
    steps = await getMigrationSteps(__dirname + '/add-rule.test.ts');
  });

  it('should add table', () => {
    expect(steps).toIncludeAnyMembers([
      {
        kind: 'add_table',
        table: 'User',
      },
    ]);
  });

  it('should add rule', () => {
    const addRuleStep = steps.find((s) => s.kind === 'add_rule');
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
