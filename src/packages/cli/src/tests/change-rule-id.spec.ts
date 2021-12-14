import { userRule } from './change-rule-id.test';
import { getRuleId } from '@daita/relational';
import { MigrationStep } from '@daita/orm';
import { getMigrationSteps } from '../utils/utils.test';

describe('cli/cmds/add/change-rule-id', () => {
  let steps: MigrationStep[] = [];

  beforeAll(async () => {
    steps = await getMigrationSteps(__dirname + '/change-rule-id.test.ts');
  });

  it('should add and drop rule with new id', () => {
    expect(steps).toEqual(
      expect.arrayContaining([
        {
          kind: 'drop_rule',
          ruleId: 'old_value',
        },
      ]),
    );
    expect(steps).toEqual(
      expect.arrayContaining([
        {
          kind: 'add_rule',
          ruleId: getRuleId(userRule),
          rule: userRule,
        },
      ]),
    );
  });
});
