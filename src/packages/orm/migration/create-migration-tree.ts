import { MigrationStep } from './migration-step';
import { MigrationTree } from './migration-tree';
import { MigrationDescription } from './migration-description';

function isMigrationStepArray(val: MigrationStep[] | MigrationStep[][]): val is MigrationStep[][] {
  return val[0] instanceof Array;
}

export function createMigrationTree(...steps: MigrationStep[]): MigrationTree;
export function createMigrationTree(...steps: MigrationStep[][]): MigrationTree;
export function createMigrationTree(...steps: MigrationStep[] | MigrationStep[][]): MigrationTree {
  if (steps.length === 0) {
    return new MigrationTree('', []);
  }
  if (isMigrationStepArray(steps)) {
    const migrations: MigrationDescription[] = [];
    let migrationId = 0;
    for (const step of steps) {
      migrations.push({
        id: `migration${migrationId}`,
        steps: step,
        after: migrationId > 0 ? `migration${migrationId - 1}` : undefined,
      });
      migrationId++;
    }
    return new MigrationTree('', migrations);
  } else {
    return new MigrationTree('', [
      {
        id: 'init',
        steps: steps,
      },
    ]);
  }
}
