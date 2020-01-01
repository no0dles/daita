import * as ts from 'typescript';
import {BaseMigrationStep} from './base-migration-step';
import {getBooleanValue, isKind} from '../generation/utils';

export class RelationalAddTableMigrationStep implements BaseMigrationStep {
  kind = "add_table";

  constructor(public table: string) {}

  toNode(): ts.NewExpression {
    return ts.createNew(
      ts.createIdentifier('RelationalAddTableMigrationStep'),
      undefined,
      [
        ts.createStringLiteral(this.table),
      ]
    );
  }

  static parse(args: ts.Expression[]): RelationalAddTableMigrationStep | null {
    const table = isKind(args[0], ts.SyntaxKind.StringLiteral);
    if(!table) {
      return null;
    }
    return new RelationalAddTableMigrationStep(table.text);
  }
}
