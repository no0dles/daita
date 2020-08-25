import { getMigrationSteps } from '../../utils.test';
import { MigrationStep } from '@daita/orm';
import { equal, field, table } from '@daita/relational';
import { User } from './add-view.test';

describe('add-view', () => {
  let steps: MigrationStep[] = [];

  beforeAll(async () => {
    steps = await getMigrationSteps(__dirname + '/add-view.test.ts');
  });

  it('should add table', () => {
    expect(steps).toIncludeAnyMembers([{
      kind: 'add_table', table: 'User',
    }]);
  });

  it('should add view', () => {
    const addViewStep = steps.find(s => s.kind === 'add_view' && s.view === 'AdminUser');
    expect(addViewStep).toEqual({
      kind: 'add_view', view: 'AdminUser',
      query: {
        select: { id: field(User, 'id') },
        from: table(User),
        where: equal(field(User, 'admin'), true),
      },
    });
  });
});

