import { SchemaDescription } from '../../schema';
import { GenerateOptions } from './generate-options';
import { MergeListResult } from '@daita/common';

export function generateDifference<T, O>(
  newSchema: SchemaDescription,
  merge: MergeListResult<T>,
  options: GenerateOptions<T, O>,
): O[] {
  const steps: O[] = [];

  for (const removed of merge.removed) {
    steps.push(...options.removeFunction(newSchema, removed.item));
  }
  for (const merged of merge.merge) {
    steps.push(...options.mergeFunction(newSchema, merged.current, merged.target));
  }
  for (const added of merge.added) {
    steps.push(...options.addFunction(newSchema, added.item));
  }

  return steps;
}
