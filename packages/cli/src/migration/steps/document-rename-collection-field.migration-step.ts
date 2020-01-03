import * as ts from 'typescript';
import { ExtendedMigrationStep } from './base-migration-step';
import { isKind } from '../generation/utils';
import { RenameCollectionFieldMigrationStep } from '@daita/core';

export class ExtendedRenameCollectionFieldMigrationStep
  extends RenameCollectionFieldMigrationStep
  implements ExtendedMigrationStep {
  toNode(): ts.NewExpression {
    return ts.createNew(
      ts.createIdentifier('RenameCollectionFieldMigrationStep'),
      undefined,
      [
        ts.createStringLiteral(this.collection),
        ts.createStringLiteral(this.oldFieldName),
        ts.createStringLiteral(this.newFieldName),
      ],
    );
  }

  static parse(
    args: ts.Expression[],
  ): RenameCollectionFieldMigrationStep | null {
    const collection = isKind(args[0], ts.SyntaxKind.StringLiteral);
    if (!collection) {
      return null;
    }
    const oldFieldName = isKind(args[1], ts.SyntaxKind.StringLiteral);
    if (!oldFieldName) {
      return null;
    }
    const newFieldName = isKind(args[2], ts.SyntaxKind.StringLiteral);
    if (!newFieldName) {
      return null;
    }
    return new RenameCollectionFieldMigrationStep(
      collection.text,
      oldFieldName.text,
      newFieldName.text,
    );
  }
}
