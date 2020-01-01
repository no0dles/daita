import * as ts from 'typescript';
import {BaseMigrationStep} from './base-migration-step';
import {isKind} from '../generation/utils';

export class AddCollectionMigrationStep implements BaseMigrationStep {
  kind = "add_collection";

  constructor(public collection: string) {}

  toNode(): ts.NewExpression {
    return ts.createNew(
      ts.createIdentifier('AddCollectionMigrationStep'),
      undefined,
      [
        ts.createStringLiteral(this.collection),
      ]
    );
  }

  static parse(args: ts.Expression[]): AddCollectionMigrationStep | null {
    const name = isKind(args[0], ts.SyntaxKind.StringLiteral);
    if(!name) {
      return null;
    }
    return new AddCollectionMigrationStep(name.text);
  }
}
