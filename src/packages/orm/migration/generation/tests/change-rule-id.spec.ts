import { getMigrationSteps } from '../../../../../testing/cli/utils.test';
import { userRule } from './change-rule-id.test';
import { MigrationStep } from '../../migration-step';
import { getRuleId } from '../../../../relational/permission/rule-id';

describe('cli/cmds/add/change-rule-id', () => {
  let steps: MigrationStep[] = [];

  beforeAll(async () => {
    steps = await getMigrationSteps(__dirname + '/change-rule-id.test.ts');
  });

  it('should add and drop rule with new id', () => {
    expect(steps).toIncludeAnyMembers([
      {
        kind: 'drop_rule',
        ruleId: 'old_value',
      },
    ]);
    expect(steps).toIncludeAnyMembers([
      {
        kind: 'add_rule',
        ruleId: getRuleId(userRule),
        rule: userRule,
      },
    ]);
  });
});
