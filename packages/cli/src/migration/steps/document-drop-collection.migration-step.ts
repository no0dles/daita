import * as ts from 'typescript';
import { ExtendedMigrationStep } from './base-migration-step';
import { isKind } from '../generation/utils';
import { DropCollectionMigrationStep } from '@daita/core';

export class ExtendedDropCollectionMigrationStep
  extends DropCollectionMigrationStep
  implements ExtendedMigrationStep {
  toNode(): ts.NewExpression {
    return ts.createNew(
      ts.createIdentifier('DropCollectionMigrationStep'),
      undefined,
      [ts.createStringLiteral(this.collection)],
    );
  }

  static parse(args: ts.Expression[]): DropCollectionMigrationStep | null {
    const name = isKind(args[0], ts.SyntaxKind.StringLiteral);
    if (!name) {
      return null;
    }
    return new DropCollectionMigrationStep(name.text);
  }
}
