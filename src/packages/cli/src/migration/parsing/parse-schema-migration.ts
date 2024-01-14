import { AstObjectValue } from '../../ast/ast-object-value';
import { getStringOrNull } from '../../ast/utils';
import { Migration, OrmSql } from '@daita/orm';
import { AstArrowFunction } from '../../ast/ast-arrow-function';
import { AstValue } from '../../ast/ast-value';
import { convertValue } from './convert-value';

export function parseSchemaMigration(migrationObject: AstObjectValue): Migration<OrmSql> {
  const id = migrationObject.stringProp('id');
  const afterProp = migrationObject.prop('after');
  const resolveProp = migrationObject.prop('resolve');
  const upProp = migrationObject.prop('up');
  const downProp = migrationObject.prop('down');

  const after = getStringOrNull(afterProp?.value);
  const resolve = getStringOrNull(resolveProp?.value);

  return {
    id,
    after: after || undefined,
    resolve: resolve || undefined,
    upMigration: parseMigrationFunction(upProp?.value),
    downMigration: parseMigrationFunction(downProp?.value),
  };
}

function parseMigrationFunction(value: AstValue | null | undefined): OrmSql[] {
  if (!value) {
    return [];
  }

  const sqls: OrmSql[] = [];
  if (value instanceof AstArrowFunction) {
    for (const call of value.callStatements()) {
      const arg = call.argumentAt(0);
      const value = convertValue(arg!);
      sqls.push(value);
    }
  }

  return sqls;
}
