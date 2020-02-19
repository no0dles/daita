import * as ts from 'typescript';
import {ExtendedMigrationStep} from './base-migration-step';
import {isKind} from '../../ast/utils';
import {AddCollectionMigrationStep} from '@daita/core';
import {AstVariableInitializer} from '../../ast/ast-variable-initializer';

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

  static parse(args: AstVariableInitializer[]): AddCollectionMigrationStep | null {
    const name = isKind(args[0], ts.SyntaxKind.StringLiteral);
    if (!name) {
      return null;
    }
    return new AddCollectionMigrationStep(name.text);
  }
}
