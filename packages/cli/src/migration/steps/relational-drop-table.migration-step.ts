import * as ts from 'typescript';
import {ExtendedMigrationStep} from './base-migration-step';
import {RelationalDropTableMigrationStep} from '@daita/core';

export class ExtendedRelationalDropTableMigrationStep extends RelationalDropTableMigrationStep implements ExtendedMigrationStep {

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
