import * as ts from 'typescript';
import { ExtendedMigrationStep } from './base-migration-step';
import { getBooleanValue, isKind } from '../../ast/utils';
import { ModifyCollectionFieldMigrationStep } from '@daita/core';

export class ExtendedModifyCollectionFieldMigrationStep
  extends ModifyCollectionFieldMigrationStep
  implements ExtendedMigrationStep {
  get className() {
    return ModifyCollectionFieldMigrationStep.name;
  }
  toNode(): ts.NewExpression {
    return ts.createNew(
      ts.createIdentifier(this.className),
      undefined,
      [
        ts.createStringLiteral(this.collection),
        ts.createStringLiteral(this.fieldName),
        this.required ? ts.createTrue() : ts.createFalse(),
        this.defaultValue
          ? ts.createStringLiteral(this.defaultValue)
          : ts.createNull(),
      ],
    );
  }

  static parse(
    args: ts.Expression[],
  ): ModifyCollectionFieldMigrationStep | null {
    const collection = isKind(args[0], ts.SyntaxKind.StringLiteral);
    if (!collection) {
      return null;
    }
    const fieldName = isKind(args[1], ts.SyntaxKind.StringLiteral);
    if (!fieldName) {
      return null;
    }
    const required = isKind(args[3], ts.SyntaxKind.BooleanKeyword);
    if (!required) {
      return null;
    }
    const defaultValue = isKind(args[4], ts.SyntaxKind.StringLiteral);
    return new ModifyCollectionFieldMigrationStep(
      collection.text,
      fieldName.text,
      getBooleanValue(required),
      defaultValue,
    );
  }
}
