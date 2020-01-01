import * as ts from 'typescript';
import {BaseMigrationStep} from './base-migration-step';
import {isKind} from '../generation/utils';

export class DropCollectionFieldMigrationStep implements BaseMigrationStep {
  kind = "drop_collection_field";

  constructor(public collection: string, public fieldName: string) {}

  toNode(): ts.NewExpression {
    return ts.createNew(
      ts.createIdentifier('DropCollectionFieldMigrationStep'),
      undefined,
      [
        ts.createStringLiteral(this.collection),
        ts.createStringLiteral(this.fieldName),
      ]
    );
  }

  static parse(args: ts.Expression[]): DropCollectionFieldMigrationStep | null {
    const collection = isKind(args[0], ts.SyntaxKind.StringLiteral);
    if(!collection) {
      return null;
    }
    const fieldName = isKind(args[1], ts.SyntaxKind.StringLiteral);
    if(!fieldName) {
      return null;
    }
    return new DropCollectionFieldMigrationStep(collection.text, fieldName.text);
  }
}
