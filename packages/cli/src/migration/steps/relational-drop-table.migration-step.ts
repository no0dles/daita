import * as ts from 'typescript';
import { ExtendedMigrationStep } from './base-migration-step';
import { RelationalDropTableMigrationStep } from '@daita/core';

export class ExtendedRelationalDropTableMigrationStep
  extends RelationalDropTableMigrationStep
  implements ExtendedMigrationStep {
  get className() {
    return RelationalDropTableMigrationStep.name;
  }
  toNode(): ts.NewExpression {
    return ts.createNew(
      ts.createIdentifier(this.className),
      undefined,
      [ts.createStringLiteral(this.table)],
    );
  }
}
