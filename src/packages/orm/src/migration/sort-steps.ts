import { MigrationStep } from './migration-step';

export function sortSteps(steps: MigrationStep[], order: MigrationStep['kind'][]): MigrationStep[] {
  return steps.sort((first, second) => {
    return order.indexOf(first.kind) - order.indexOf(second.kind);
  });
}
