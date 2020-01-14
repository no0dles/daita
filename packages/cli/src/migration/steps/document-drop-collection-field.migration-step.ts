import * as ts from 'typescript';
import { ExtendedMigrationStep } from './base-migration-step';
import { isKind } from '../generation/utils';
import { DropCollectionFieldMigrationStep } from '@daita/core';

export class ExtendedDropCollectionFieldMigrationStep
  extends DropCollectionFieldMigrationStep
  implements ExtendedMigrationStep {
  get className() {
    return DropCollectionFieldMigrationStep.name;
  }
  toNode(): ts.NewExpression {
    return ts.createNew(
      ts.createIdentifier(this.className),
      undefined,
      [
        ts.createStringLiteral(this.collection),
        ts.createStringLiteral(this.fieldName),
      ],
    );
  }

  static parse(args: ts.Expression[]): DropCollectionFieldMigrationStep | null {
    const collection = isKind(args[0], ts.SyntaxKind.StringLiteral);
    if (!collection) {
      return null;
    }
    const fieldName = isKind(args[1], ts.SyntaxKind.StringLiteral);
    if (!fieldName) {
      return null;
    }
    return new DropCollectionFieldMigrationStep(
      collection.text,
      fieldName.text,
    );
  }
}
