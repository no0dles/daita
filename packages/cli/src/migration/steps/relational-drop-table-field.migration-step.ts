import * as ts from 'typescript';
import {ExtendedMigrationStep} from './base-migration-step';
import {RelationalDropTableFieldMigrationStep} from '@daita/core';

export class ExtendedRelationalDropTableFieldMigrationStep extends RelationalDropTableFieldMigrationStep implements ExtendedMigrationStep {

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
