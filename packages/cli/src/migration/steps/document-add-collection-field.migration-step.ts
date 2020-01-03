import * as ts from 'typescript';
import { ExtendedMigrationStep } from './base-migration-step';
import { isKind, getBooleanValue } from '../generation/utils';
import { AddCollectionFieldMigrationStep } from '@daita/core';

export class ExtendedAddCollectionFieldMigrationStep
  extends AddCollectionFieldMigrationStep
  implements ExtendedMigrationStep {
  toNode(): ts.NewExpression {
    return ts.createNew(
      ts.createIdentifier('AddCollectionFieldMigrationStep'),
      undefined,
      [
        ts.createStringLiteral(this.collection),
        ts.createStringLiteral(this.fieldName),
        ts.createStringLiteral(this.type),
        this.required ? ts.createTrue() : ts.createFalse(),
        this.defaultValue
          ? ts.createStringLiteral(this.defaultValue)
          : ts.createNull(),
      ],
    );
  }

  static parse(args: ts.Expression[]): AddCollectionFieldMigrationStep | null {
    const collection = isKind(args[0], ts.SyntaxKind.StringLiteral);
    if (!collection) {
      return null;
    }

    const fieldName = isKind(args[1], ts.SyntaxKind.StringLiteral);
    if (!fieldName) {
      return null;
    }

    const type = isKind(args[2], ts.SyntaxKind.StringLiteral);
    if (!type) {
      return null;
    }

    if (
      type.text !== 'string' &&
      type.text !== 'number' &&
      type.text !== 'date' &&
      type.text !== 'invalid' &&
      type.text !== 'string[]' &&
      type.text !== 'number[]' &&
      type.text !== 'date[]'
    ) {
      return null;
    }

    const required = isKind(args[3], ts.SyntaxKind.BooleanKeyword);
    const defaultValue = isKind(args[4], ts.SyntaxKind.StringLiteral);

    return new AddCollectionFieldMigrationStep(
      collection.text,
      fieldName.text,
      type.text,
      required ? getBooleanValue(required) : false,
      defaultValue ? defaultValue.text : null,
    );
  }
}
