import { getMigrationSteps } from '../../utils.test';
import { MigrationStep } from '@daita/orm';
import { User } from './add-view.test';
import { userRule } from './change-rule-id.test';

describe('change-rule-id', () => {
  let steps: MigrationStep[] = [];

  beforeAll(async () => {
    steps = await getMigrationSteps(__dirname + '/change-rule-id.test.ts');
  });

  it('should add and drop rule with new id', () => {
    expect(steps).toIncludeAnyMembers([{
      kind: 'drop_rule', ruleId: 'old_value',
    }]);
    expect(steps).toIncludeAnyMembers([{
      kind: 'add_rule',
      ruleId: '60d01049309a803bce9e3cb0e58783bbb1b9ed517afbe1b5d218d39d3adc4482',
      rule: userRule,
    }]);
  });
});
