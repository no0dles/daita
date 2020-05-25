import {AstVariable} from '../../ast/ast-variable';
import {parseSchemaMigrationStep} from './parse-schema-migration-step';
import { MigrationDescription, MigrationStep } from '@daita/orm';

export function parseSchemaMigration(
  migrationVariable: AstVariable,
): MigrationDescription {
  if (!migrationVariable.initializer) {
    throw new Error('missing init for variable');
  }

  const idProp = migrationVariable.initializer.property('id');
  const afterProp = migrationVariable.initializer.property('after');
  const resolveProp = migrationVariable.initializer.property('resolve');
  const stepsProp = migrationVariable.initializer.property('steps');

  let after: string | null = null;
  let resolve: string | null = null;
  const steps: MigrationStep[] = [];

  if (!idProp || !idProp.stringValue) {
    throw new Error('missing id prop in migration');
  }

  if (afterProp && afterProp.stringValue) {
    after = afterProp.stringValue;
  }

  if (resolveProp && resolveProp.stringValue) {
    resolve = resolveProp.stringValue;
  }

  if (!stepsProp || !stepsProp.arrayValue) {
    throw new Error('missing steps prop in migration');
  }

  for (const step of stepsProp.arrayValue) {
    steps.push(parseSchemaMigrationStep(step));
  }

  return {
    id: idProp.stringValue,
    after: after || undefined,
    resolve: resolve || undefined,
    steps,
  };
}
