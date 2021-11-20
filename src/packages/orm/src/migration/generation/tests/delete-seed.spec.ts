import { getMigrationSteps } from '../../../../../testing/cli/utils.test';
import { MigrationStep } from '../../migration-step';

describe('cli/cmds/add/delete-seed', () => {
  let steps: MigrationStep[] = [];

  beforeAll(async () => {
    steps = await getMigrationSteps(__dirname + '/delete-seed.test.ts');
  });

  it('should delete seed', () => {
    expect(steps).toIncludeAnyMembers([
      {
        kind: 'delete_seed',
        table: 'User',
        keys: { id: 'a' },
      },
    ]);
  });
});
