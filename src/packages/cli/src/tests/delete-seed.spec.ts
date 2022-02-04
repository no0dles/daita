import { MigrationStep } from '@daita/orm';
import { getMigrationSteps } from '../utils/utils.test';

describe('cli/cmds/add/delete-seed', () => {
  let steps: MigrationStep[] = [];

  beforeAll(async () => {
    steps = await getMigrationSteps(__dirname + '/delete-seed.test.ts');
  });

  it('should delete seed', () => {
    expect(steps).toEqual(
      expect.arrayContaining([
        {
          kind: 'delete_seed',
          table: 'User',
          keys: { id: 'a' },
        },
      ]),
    );
  });
});
