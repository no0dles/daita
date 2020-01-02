import * as ts from 'typescript';
import {ExtendedMigrationStep} from './base-migration-step';
import {getBooleanValue, isKind} from '../generation/utils';
import {RelationalAddTableMigrationStep} from '@daita/core';

export class ExtendedRelationalAddTableMigrationStep extends RelationalAddTableMigrationStep implements ExtendedMigrationStep {
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
