import { getMigrationSteps } from '../../../../testing/cli/utils.test';
import { MigrationStep } from '../../../orm/migration/migration-step';

describe('cli/cmds/add/update-seed', () => {
  let steps: MigrationStep[] = [];

  beforeAll(async () => {
    steps = await getMigrationSteps(__dirname + '/update-seed.test.ts');
  });

  it('should update seed', () => {
    expect(steps).toIncludeAnyMembers([
      {
        kind: 'update_seed',
        table: 'User',
        keys: { id: 'a' },
        seed: { admin: true },
      },
    ]);
  });
});
