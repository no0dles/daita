import { MigrationStep } from '@daita/orm';
import { getMigrationSteps } from '../utils/utils.test';

describe('cli/cmds/add/update-seed', () => {
  let steps: MigrationStep[] = [];

  beforeAll(async () => {
    steps = await getMigrationSteps(__dirname + '/update-seed.test.ts');
  });

  it('should update seed', () => {
    expect(steps).toEqual(
      expect.arrayContaining([
        {
          kind: 'update_seed',
          table: 'User',
          keys: { id: 'a' },
          seed: { admin: true },
        },
      ]),
    );
  });
});
