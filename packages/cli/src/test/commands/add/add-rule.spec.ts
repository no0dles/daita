import { getMigrationSteps } from '../../utils.test';
import { MigrationStep } from '@daita/orm';
import { User } from './add-view.test';
import { allow, authorized, field, table } from '@daita/relational';

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
    expect(addRuleStep).toEqual({
      kind: 'add_rule',
      rule: allow(authorized(), {
        select: field(User, 'id'),
        from: table(User),
      })
    });
  });
});
