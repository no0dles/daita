import { getMigrationSteps } from '../../utils.test';
import { MigrationStep } from '../../../../orm/migration';

describe('delete-seed', () => {
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
