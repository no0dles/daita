import * as ts from 'typescript';
import {BaseMigrationStep} from './base-migration-step';
import {isKind} from '../generation/utils';

export class DropCollectionMigrationStep implements BaseMigrationStep {
  kind = "drop_collection";

  constructor(public collection: string) {}

  toNode(): ts.NewExpression {
    return ts.createNew(
      ts.createIdentifier('DropCollectionMigrationStep'),
      undefined,
      [
        ts.createStringLiteral(this.collection),
      ]
    );
  }

  static parse(args: ts.Expression[]): DropCollectionMigrationStep | null {
    const name = isKind(args[0], ts.SyntaxKind.StringLiteral);
    if(!name) {
      return null;
    }
    return new DropCollectionMigrationStep(name.text);
  }
}
