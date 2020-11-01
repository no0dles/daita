import { getMigrationSteps } from '../../utils.test';
import { userRule } from './change-rule-id.test';
import { MigrationStep } from '../../../../orm/migration/migration-step';
import { getRuleId } from '../../../../orm/migration/generation/rule-id';

describe('change-rule-id', () => {
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
