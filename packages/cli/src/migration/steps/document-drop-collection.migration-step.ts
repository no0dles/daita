import * as ts from 'typescript';
import { ExtendedMigrationStep } from './base-migration-step';
import { isKind } from '../../ast/utils';
import { DropCollectionMigrationStep } from '@daita/core';

export class ExtendedDropCollectionMigrationStep
  extends DropCollectionMigrationStep
  implements ExtendedMigrationStep {
  get className() {
    return DropCollectionMigrationStep.name;
  }
  toNode(): ts.NewExpression {
    return ts.createNew(
      ts.createIdentifier(this.className),
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
