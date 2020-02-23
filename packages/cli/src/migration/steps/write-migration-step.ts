import {MigrationStep} from '@daita/core';
import * as ts from 'typescript';

export function writeMigrationStep(migrationStep: MigrationStep): ts.ObjectLiteralExpression {
  if (migrationStep.kind === 'add_collection') {
    return ts.createObjectLiteral([
      ts.createPropertyAssignment('kind', ts.createStringLiteral(migrationStep.kind)),
      ts.createPropertyAssignment('collection', ts.createStringLiteral(migrationStep.collection)),
    ]);
  } else if (migrationStep.kind === 'add_table_foreign_key') {
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
  } else if (migrationStep.kind === 'drop_table_field') {
    return ts.createObjectLiteral([
      ts.createPropertyAssignment('kind', ts.createStringLiteral(migrationStep.kind)),
      ts.createPropertyAssignment('table', ts.createStringLiteral(migrationStep.table)),
      ts.createPropertyAssignment('fieldName', ts.createStringLiteral(migrationStep.fieldName)),
    ]);
  }

  return fail(migrationStep, `Unknown migration step ${JSON.stringify(migrationStep)}`);
}

function fail(value: never, message: string): never {
  throw new Error(message);
}