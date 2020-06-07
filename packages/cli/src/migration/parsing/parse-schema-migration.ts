import {parseSchemaMigrationStep} from './parse-schema-migration-step';
import { MigrationDescription, MigrationStep } from '@daita/orm';
import { AstObjectValue } from '../../ast/ast-object-value';

export function parseSchemaMigration(
  migrationObject: AstObjectValue,
): MigrationDescription {

  const idProp = migrationObject.property('id');
  const afterProp = migrationObject.property('after');
  const resolveProp = migrationObject.property('resolve');
  const stepsProp = migrationObject.property('steps');

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
