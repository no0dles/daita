import { getMigrationSteps } from '../../../../../testing/cli/utils.test';
import { User } from './add-view.test';
import { field } from '@daita/relational/sql/keyword/field/field';
import { MigrationStep } from '../../migration-step';
import { table } from '@daita/relational/sql/keyword/table/table';
import { equal } from '@daita/relational/sql/operands/comparison/equal/equal';

describe('cli/cmds/add/add-view', () => {
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
