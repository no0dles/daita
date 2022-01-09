import { MigrationStep } from '@daita/orm';
import { getMigrationSteps } from '../utils/utils.test';

describe('cli/cmds/add/add-seed', () => {
  let steps: MigrationStep[] = [];

  beforeAll(async () => {
    steps = await getMigrationSteps(__dirname + '/add-seed.test.ts');
  });

  it('should add seed', () => {
    expect(steps).toEqual(
      expect.arrayContaining([
        {
          kind: 'insert_seed',
          table: 'User',
          keys: { id: 'a' },
          seed: { admin: false },
        },
      ]),
    );
    expect(steps).toEqual(
      expect.arrayContaining([
        {
          kind: 'insert_seed',
          table: 'User',
          keys: { id: 'b' },
          seed: { admin: true },
        },
      ]),
    );
  });
});
