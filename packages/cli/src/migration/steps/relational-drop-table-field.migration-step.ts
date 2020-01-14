import * as ts from 'typescript';
import { ExtendedMigrationStep } from './base-migration-step';
import { RelationalDropTableFieldMigrationStep } from '@daita/core';

export class ExtendedRelationalDropTableFieldMigrationStep
  extends RelationalDropTableFieldMigrationStep
  implements ExtendedMigrationStep {
  get className() {
    return RelationalDropTableFieldMigrationStep.name;
  }
  toNode(): ts.NewExpression {
    return ts.createNew(
      ts.createIdentifier(this.className),
      undefined,
      [
        ts.createStringLiteral(this.table),
        ts.createStringLiteral(this.fieldName),
      ],
    );
  }
}
