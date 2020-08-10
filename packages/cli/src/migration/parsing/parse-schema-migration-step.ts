import { AstObjectValue } from '../../ast/ast-object-value';
import { MigrationStep, RelationalTableSchemaTableFieldType } from '@daita/orm';
import { getRawValue } from './parse-relational-type';
import { getStringValue } from '../../ast/utils';

export function parseSchemaMigrationStep(step: AstObjectValue): MigrationStep {
  const migrationStep = { kind: step.stringProp('kind') } as MigrationStep;
  if (!migrationStep.kind) {
    throw Error('missing kind in migration step');
  }

  if (migrationStep.kind === 'add_table') {
    return { kind: 'add_table', table: step.stringProp('table') };
  } else if (migrationStep.kind === 'drop_table') {
    return { kind: 'drop_table', table: step.stringProp('table') };
  } else if (migrationStep.kind === 'add_table_field') {
    const defaultValue = step.prop('defaultValue');
    const type = step.stringProp('type') as RelationalTableSchemaTableFieldType;
    return {
      kind: 'add_table_field',
      table: step.stringProp('table'),
      fieldName: step.stringProp('fieldName'),
      required: step.booleanProp('required'),
      defaultValue: defaultValue ? getRawValue(type, defaultValue.value) : undefined,
      type,
    };
  } else if (migrationStep.kind === 'add_table_foreign_key') {
    return {
      kind: 'add_table_foreign_key',
      table: step.stringProp('table'),
      foreignTable: step.stringProp('foreignTable'),
      name: step.stringProp('name'),
      fieldNames: step.arrayProp('fieldNames', e => getStringValue(e)),
      foreignFieldNames: step.arrayProp('foreignFieldNames', e => getStringValue(e)),
      required: step.booleanProp('required'),
    };
  } else if (migrationStep.kind === 'add_table_primary_key') {
    return {
      kind: 'add_table_primary_key',
      table: step.stringProp('table'),
      fieldNames: step.arrayProp('fieldNames', e => getStringValue(e)),
    };
  } else if (migrationStep.kind === 'drop_table_field') {
    return {
      kind: 'drop_table_field',
      table: step.stringProp('table'),
      fieldName: step.stringProp('fieldName'),
    };
  } else if (migrationStep.kind === 'create_index') {
    return {
      kind: 'create_index',
      table: step.stringProp('table'),
      name: step.stringProp('name'),
      fields: step.arrayProp('fields', e => getStringValue(e)),
      unique: step.booleanProp('unique'),
    };
  } else if (migrationStep.kind === 'drop_index') {
    return {
      kind: 'drop_index',
      table: step.stringProp('table'),
      name: step.stringProp('name'),
    };
  } else if (migrationStep.kind === 'drop_table_foreign_key') {
    return {
      kind: 'drop_table_foreign_key',
      table: step.stringProp('table'),
      name: step.stringProp('name'),
    };
  }

  //TODO schema is missing?

  return fail(migrationStep, `Unknown migration step ${JSON.stringify(migrationStep)}`);
}


function fail(value: never, message: string): never {
  throw new Error(message);
}
