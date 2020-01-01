import * as ts from 'typescript';
import {BaseMigrationStep} from './base-migration-step';

export class RelationalDropTableFieldMigrationStep implements BaseMigrationStep {
  kind = "drop_table_field";

  constructor(public table: string, public fieldName: string) {}

  toNode(): ts.NewExpression {
    return ts.createNew(
      ts.createIdentifier('RelationalDropTableFieldMigrationStep'),
      undefined,
      [
        ts.createStringLiteral(this.table),
        ts.createStringLiteral(this.fieldName),
      ]
    );
  }
}
