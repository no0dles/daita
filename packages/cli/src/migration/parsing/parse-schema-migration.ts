import { MigrationDescription } from '@daita/orm';
import { AstObjectValue } from '../../ast/ast-object-value';
import { getObjectValue, getStringOrNull } from '../../ast/utils';
import { convertValue } from './convert-value';

export function parseSchemaMigration(
  migrationObject: AstObjectValue,
): MigrationDescription {

  const id = migrationObject.stringProp('id');
  const steps = migrationObject.arrayProp('steps', elm => {
    const objectValue = getObjectValue(elm);
    return convertValue(objectValue);
  });
  const afterProp = migrationObject.prop('after');
  const resolveProp = migrationObject.prop('resolve');

  const after = getStringOrNull(afterProp?.value);
  const resolve = getStringOrNull(resolveProp?.value);

  return {
    id,
    after: after || undefined,
    resolve: resolve || undefined,
    steps,
  };
}
