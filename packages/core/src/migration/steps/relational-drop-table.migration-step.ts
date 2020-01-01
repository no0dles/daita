import * as ts from 'typescript';
import {BaseMigrationStep} from './base-migration-step';

export class RelationalDropTableMigrationStep implements BaseMigrationStep {
  kind = "drop_table";

  constructor(public table: string) {}

  toNode(): ts.NewExpression {
    return ts.createNew(
      ts.createIdentifier(RelationalDropTableMigrationStep.name),
      undefined,
      [
        ts.createStringLiteral(this.table),
      ]
    );
  }
}
