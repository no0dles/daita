import { getMigrationSteps } from '../../../../../testing/cli/utils.test';
import { MigrationStep } from '../../migration-step';

describe('cli/cmds/add/add-seed', () => {
  let steps: MigrationStep[] = [];

  beforeAll(async () => {
    steps = await getMigrationSteps(__dirname + '/add-seed.test.ts');
  });

  it('should add seed', () => {
    expect(steps).toIncludeAnyMembers([
      {
        kind: 'insert_seed',
        table: 'User',
        keys: { id: 'a' },
        seed: { admin: false },
      },
    ]);
    expect(steps).toIncludeAnyMembers([
      {
        kind: 'insert_seed',
        table: 'User',
        keys: { id: 'b' },
        seed: { admin: true },
      },
    ]);
  });
});
