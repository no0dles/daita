import { AstObjectValue } from '../../ast/ast-object-value';
import { MigrationStep, RelationalTableSchemaTableFieldType } from '@daita/orm';

export function parseSchemaMigrationStep(step: AstObjectValue): MigrationStep {
  const migrationStep = { kind: step.property('kind')?.stringValue } as MigrationStep;
  if (!migrationStep.kind) {
    throw Error('missing kind in migration step');
  }

  if (migrationStep.kind === 'add_table') {
    return { kind: 'add_table', table: getStringValue(step, 'table') };
  } else if (migrationStep.kind === 'drop_table') {
    return { kind: 'drop_table', table: getStringValue(step, 'table') };
  } else if (migrationStep.kind === 'add_table_field') {
    return {
      kind: 'add_table_field',
      table: getStringValue(step, 'table'),
      fieldName: getStringValue(step, 'fieldName'),
      required: getBooleanValue(step, 'required'),
      defaultValue: getAnyValue(step, 'defaultValue', undefined),
      type: getStringValue(step, 'type') as RelationalTableSchemaTableFieldType,
    };
  } else if (migrationStep.kind === 'add_table_foreign_key') {
    return {
      kind: 'add_table_foreign_key',
      table: getStringValue(step, 'table'),
      foreignTable: getStringValue(step, 'foreignTable'),
      name: getStringValue(step, 'name'),
      fieldNames: getArrayValue(step, 'fieldNames', v => v.stringValue),
      foreignFieldNames: getArrayValue(step, 'foreignFieldNames', v => v.stringValue),
      required: getBooleanValue(step, 'required'),
    };
  } else if (migrationStep.kind === 'add_table_primary_key') {
    return {
      kind: 'add_table_primary_key',
      table: getStringValue(step, 'table'),
      fieldNames: getArrayValue(step, 'fieldNames', v => v.stringValue),
    };
  } else if (migrationStep.kind === 'drop_table_field') {
    return {
      kind: 'drop_table_field',
      table: getStringValue(step, 'table'),
      fieldName: getStringValue(step, 'fieldName'),
    };
  } else if (migrationStep.kind === 'create_index') {
    return {
      kind: 'create_index',
      table: getStringValue(step, 'table'),
      name: getStringValue(step, 'name'),
      fields: getArrayValue(step, 'fields', v => v.stringValue),
      unique: getBooleanValue(step, 'unique'),
    }
  } else if (migrationStep.kind === 'drop_index') {
    return {
      kind: 'drop_index',
      table: getStringValue(step, 'table'),
      name: getStringValue(step, 'name'),
    }
  }

  //TODO schema is missing?

  return fail(migrationStep, `Unknown migration step ${JSON.stringify(migrationStep)}`);
}

function getAnyValue(step: AstObjectValue, key: string, defaultValue?: any) {
  const property = step.property(key);
  if (!property) {
    if (arguments.length === 3) {
      return defaultValue;
    }
    throw new Error(`missing ${key} in migration step`);
  }
  return property.anyValue;
}

function getBooleanValue(step: AstObjectValue, key: string) {
  const value = step.property(key)?.booleanValue;
  if (value === undefined || value === null) {
    throw new Error(`missing ${key} in migration step`);
  }
  return value;
}

function getArrayValue<T>(step: AstObjectValue, key: string, selector: (value: AstObjectValue) => T | null): T[] {
  const values = step.property(key)?.arrayValue;
  if (!values) {
    throw new Error(`missing ${key} in migration step`);
  }
  const items = new Array<T>();
  for (const value of values) {
    const item = selector(value);
    if (!item) {
      throw new Error(`item in ${key} is invalid for migration step`);
    }
    items.push(item);
  }
  return items;
}

function getStringValue(step: AstObjectValue, key: string) {
  const value = step.property(key)?.stringValue;
  if (!value) {
    throw new Error(`missing ${key} in migration step`);
  }
  return value;
}

function fail(value: never, message: string): never {
  throw new Error(message);
}
