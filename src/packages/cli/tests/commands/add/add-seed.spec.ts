import { getMigrationSteps } from '../../utils.test';
import { MigrationStep } from '../../../../orm/migration/migration-step';

describe('add-seed', () => {
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
