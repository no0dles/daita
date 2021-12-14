import { User } from './add-view.test';
import { field } from '@daita/relational';
import { table } from '@daita/relational';
import { equal } from '@daita/relational';
import { MigrationStep } from '@daita/orm';
import { getMigrationSteps } from '../utils/utils.test';

describe('cli/cmds/add/add-view', () => {
  let steps: MigrationStep[] = [];

  beforeAll(async () => {
    steps = await getMigrationSteps(__dirname + '/add-view.test.ts');
  });

  it('should add table', () => {
    expect(steps).toEqual(
      expect.arrayContaining([
        {
          kind: 'add_table',
          table: 'User',
        },
      ]),
    );
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
