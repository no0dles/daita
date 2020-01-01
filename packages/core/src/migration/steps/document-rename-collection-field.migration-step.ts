import * as ts from 'typescript';
import {BaseMigrationStep} from './base-migration-step';
import {isKind} from '../generation/utils';

export class RenameCollectionFieldMigrationStep implements BaseMigrationStep {
  kind = "rename_collection_field";

  constructor(
    public collection: string,
    public oldFieldName: string,
    public newFieldName: string
  ) {}

  toNode(): ts.NewExpression {
    return ts.createNew(
      ts.createIdentifier('RenameCollectionFieldMigrationStep'),
      undefined,
      [
        ts.createStringLiteral(this.collection),
        ts.createStringLiteral(this.oldFieldName),
        ts.createStringLiteral(this.newFieldName),
      ]
    );
  }

  static parse(args: ts.Expression[]): RenameCollectionFieldMigrationStep | null {
    const collection = isKind(args[0], ts.SyntaxKind.StringLiteral);
    if(!collection) {
      return null;
    }
    const oldFieldName = isKind(args[1], ts.SyntaxKind.StringLiteral);
    if(!oldFieldName) {
      return null;
    }
    const newFieldName = isKind(args[2], ts.SyntaxKind.StringLiteral);
    if(!newFieldName) {
      return null;
    }
    return new RenameCollectionFieldMigrationStep(collection.text, oldFieldName.text, newFieldName.text);
  }
}
