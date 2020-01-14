import * as ts from 'typescript';
import {ExtendedMigrationStep} from './base-migration-step';
import {isKind} from '../generation/utils';
import {AddCollectionMigrationStep} from '@daita/core';

export class ExtendedAddCollectionMigrationStep
  extends AddCollectionMigrationStep
  implements ExtendedMigrationStep {
  get className() {
    return AddCollectionMigrationStep.name;
  }

  toNode(): ts.NewExpression {
    return ts.createNew(
      ts.createIdentifier(this.className),
      undefined,
      [ts.createStringLiteral(this.collection)],
    );
  }

  static parse(args: ts.Expression[]): AddCollectionMigrationStep | null {
    const name = isKind(args[0], ts.SyntaxKind.StringLiteral);
    if (!name) {
      return null;
    }
    return new AddCollectionMigrationStep(name.text);
  }
}
