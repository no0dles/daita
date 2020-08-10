import * as ts from 'typescript';
import { MigrationStep } from '@daita/orm';

export function writeDocumentMigrationStep(migrationStep: any) {
  if (migrationStep.kind === 'add_collection') {
    return ts.createObjectLiteral([
      ts.createPropertyAssignment('kind', ts.createStringLiteral(migrationStep.kind)),
      ts.createPropertyAssignment('collection', ts.createStringLiteral(migrationStep.collection)),
    ]);
  } else if (migrationStep.kind === 'modify_collection_field') {
    return ts.createObjectLiteral([
      ts.createPropertyAssignment('kind', ts.createStringLiteral(migrationStep.kind)),
      ts.createPropertyAssignment('collection', ts.createStringLiteral(migrationStep.collection)),
      ts.createPropertyAssignment('fieldName', ts.createStringLiteral(migrationStep.fieldName)),
      ts.createPropertyAssignment('required', migrationStep.required ? ts.createTrue() : ts.createFalse()),
      ts.createPropertyAssignment('defaultValue', migrationStep.defaultValue
        ? ts.createStringLiteral(migrationStep.defaultValue)
        : ts.createNull()),
    ]);
  } else if (migrationStep.kind === 'drop_collection_field') {
    return ts.createObjectLiteral([
      ts.createPropertyAssignment('kind', ts.createStringLiteral(migrationStep.kind)),
      ts.createPropertyAssignment('collection', ts.createStringLiteral(migrationStep.collection)),
      ts.createPropertyAssignment('fieldName', ts.createStringLiteral(migrationStep.fieldName)),
    ]);
  } else if (migrationStep.kind === 'drop_collection') {
    return ts.createObjectLiteral([
      ts.createPropertyAssignment('kind', ts.createStringLiteral(migrationStep.kind)),
      ts.createPropertyAssignment('collection', ts.createStringLiteral(migrationStep.collection)),
    ]);
  } else if (migrationStep.kind === 'rename_collection_field') {
    return ts.createObjectLiteral([
      ts.createPropertyAssignment('kind', ts.createStringLiteral(migrationStep.kind)),
      ts.createPropertyAssignment('collection', ts.createStringLiteral(migrationStep.collection)),
      ts.createPropertyAssignment('oldFieldName', ts.createStringLiteral(migrationStep.oldFieldName)),
      ts.createPropertyAssignment('newFieldName', ts.createStringLiteral(migrationStep.newFieldName)),
    ]);
  } else if (migrationStep.kind === 'add_collection_field') {
    return ts.createObjectLiteral([
      ts.createPropertyAssignment('kind', ts.createStringLiteral(migrationStep.kind)),
      ts.createPropertyAssignment('collection', ts.createStringLiteral(migrationStep.collection)),
      ts.createPropertyAssignment('fieldName', ts.createStringLiteral(migrationStep.fieldName)),
      ts.createPropertyAssignment('type', ts.createStringLiteral(migrationStep.type)),
      ts.createPropertyAssignment('required', migrationStep.required ? ts.createTrue() : ts.createFalse()),
      ts.createPropertyAssignment('defaultValue', migrationStep.defaultValue
        ? ts.createStringLiteral(migrationStep.defaultValue)
        : ts.createNull()),
    ]);
  }
}

export function writeRelationalMigrationStep(migrationStep: MigrationStep): ts.ObjectLiteralExpression {
  if (migrationStep.kind === 'add_table_foreign_key') {
    return ts.createObjectLiteral([
      ts.createPropertyAssignment('kind', ts.createStringLiteral(migrationStep.kind)),
      ts.createPropertyAssignment('table', ts.createStringLiteral(migrationStep.table)),
      ts.createPropertyAssignment('name', ts.createStringLiteral(migrationStep.name)),
      ts.createPropertyAssignment('foreignTable', ts.createStringLiteral(migrationStep.foreignTable)),
      ts.createPropertyAssignment('fieldNames', ts.createArrayLiteral(
        migrationStep.fieldNames.map(fieldName => ts.createStringLiteral(fieldName)),
      )),
      ts.createPropertyAssignment('foreignFieldNames', ts.createArrayLiteral(
        migrationStep.foreignFieldNames.map(fieldName => ts.createStringLiteral(fieldName)),
      )),
      ts.createPropertyAssignment('required', migrationStep.required ? ts.createTrue() : ts.createFalse()),
    ]);
  } else if (migrationStep.kind === 'add_table_primary_key') {
    return ts.createObjectLiteral([
      ts.createPropertyAssignment('kind', ts.createStringLiteral(migrationStep.kind)),
      ts.createPropertyAssignment('table', ts.createStringLiteral(migrationStep.table)),
      ts.createPropertyAssignment('fieldNames', ts.createArrayLiteral(
        migrationStep.fieldNames.map(fieldName => ts.createStringLiteral(fieldName)),
      )),
    ]);
  } else if (migrationStep.kind === 'add_table_field') {
    return ts.createObjectLiteral([
      ts.createPropertyAssignment('kind', ts.createStringLiteral(migrationStep.kind)),
      ts.createPropertyAssignment('table', ts.createStringLiteral(migrationStep.table)),
      ts.createPropertyAssignment('fieldName', ts.createStringLiteral(migrationStep.fieldName)),
      ts.createPropertyAssignment('type', ts.createStringLiteral(migrationStep.type)),
      ts.createPropertyAssignment('required', migrationStep.required ? ts.createTrue() : ts.createFalse()),
      ts.createPropertyAssignment('defaultValue', migrationStep.defaultValue
        ? ts.createStringLiteral(migrationStep.defaultValue)
        : ts.createNull()),
    ]);
  } else if (migrationStep.kind === 'add_table') {
    return ts.createObjectLiteral([
      ts.createPropertyAssignment('kind', ts.createStringLiteral(migrationStep.kind)),
      ts.createPropertyAssignment('table', ts.createStringLiteral(migrationStep.table)),
    ]);
  } else if (migrationStep.kind === 'drop_table') {
    return ts.createObjectLiteral([
      ts.createPropertyAssignment('kind', ts.createStringLiteral(migrationStep.kind)),
      ts.createPropertyAssignment('table', ts.createStringLiteral(migrationStep.table)),
    ]);
  } else if (migrationStep.kind === 'drop_table_field') {
    return ts.createObjectLiteral([
      ts.createPropertyAssignment('kind', ts.createStringLiteral(migrationStep.kind)),
      ts.createPropertyAssignment('table', ts.createStringLiteral(migrationStep.table)),
      ts.createPropertyAssignment('fieldName', ts.createStringLiteral(migrationStep.fieldName)),
    ]);
  } else if (migrationStep.kind === 'create_index') {
    return ts.createObjectLiteral([
      ts.createPropertyAssignment('kind', ts.createStringLiteral(migrationStep.kind)),
      ts.createPropertyAssignment('table', ts.createStringLiteral(migrationStep.table)),
      ts.createPropertyAssignment('name', ts.createStringLiteral(migrationStep.name)),
      ts.createPropertyAssignment('unique', migrationStep.unique ? ts.createTrue() : ts.createFalse()),
      ts.createPropertyAssignment('fields', ts.createArrayLiteral(
        migrationStep.fields.map(fieldName => ts.createStringLiteral(fieldName)),
      )),
    ]);
  } else if (migrationStep.kind === 'drop_index') {
    return ts.createObjectLiteral([
      ts.createPropertyAssignment('kind', ts.createStringLiteral(migrationStep.kind)),
      ts.createPropertyAssignment('table', ts.createStringLiteral(migrationStep.table)),
      ts.createPropertyAssignment('name', ts.createStringLiteral(migrationStep.name)),
    ]);
  } else if (migrationStep.kind === 'drop_table_foreign_key') {
    return ts.createObjectLiteral([
      ts.createPropertyAssignment('kind', ts.createStringLiteral(migrationStep.kind)),
      ts.createPropertyAssignment('table', ts.createStringLiteral(migrationStep.table)),
      ts.createPropertyAssignment('name', ts.createStringLiteral(migrationStep.name)),
    ]);
  }

  //TODO schema is missing?

  return fail(migrationStep, `Unknown migration step ${JSON.stringify(migrationStep)}`);
}

function createObject(object: any) {
  const keys = Object.keys(object);
  const properties = new Array<ts.ObjectLiteralElementLike>();
  for (const key of keys) {
    properties.push(ts.createPropertyAssignment(key, createValue(object[key])));
  }
  return ts.createObjectLiteral(properties);
}

function createValue(value: any): ts.Expression {
  if (typeof value === 'string') {
    return ts.createStringLiteral(value);
  } else if (typeof value === 'number') {
    return ts.createNumericLiteral(value.toString());
  } else if (typeof value === 'boolean') {
    return value ? ts.createTrue() : ts.createFalse();
  } else if (typeof value === 'object') {
    if (Array.isArray(value)) {
      return ts.createArrayLiteral(value.map(item => createValue(item)));
    } else {
      return createObject(value);
    }
  } else {
    throw new Error('unknown type ' + typeof value);
  }
}

function fail(value: never, message: string): never {
  throw new Error(message);
}
