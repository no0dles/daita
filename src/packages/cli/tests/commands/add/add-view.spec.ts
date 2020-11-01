import { getMigrationSteps } from '../../utils.test';
import { User } from './add-view.test';
import { field } from '../../../../relational/sql/function/field';
import { MigrationStep } from '../../../../orm/migration/migration-step';
import { table } from '../../../../relational/sql/function/table';
import { equal } from '../../../../relational/sql/function/equal';

describe('add-view', () => {
  let steps: MigrationStep[] = [];

  beforeAll(async () => {
    steps = await getMigrationSteps(__dirname + '/add-view.test.ts');
  });

  it('should add table', () => {
    expect(steps).toIncludeAnyMembers([
      {
        kind: 'add_table',
        table: 'User',
      },
    ]);
  });

  it('should add view', () => {
    const addViewStep = steps.find((s) => s.kind === 'add_view' && s.view === 'AdminUser');
    expect(addViewStep).toEqual({
      kind: 'add_view',
      view: 'AdminUser',
      query: {
        select: { id: field(User, 'id') },
        from: table(User),
        where: equal(field(User, 'admin'), true),
      },
    });
  });
});
