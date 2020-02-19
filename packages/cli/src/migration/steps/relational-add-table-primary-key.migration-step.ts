import * as ts from 'typescript';
import { ExtendedMigrationStep } from './base-migration-step';
import { isKind } from '../../ast/utils';
import { RelationalAddTablePrimaryKey } from '@daita/core';

export class ExtendedRelationalAddTablePrimaryKey
  extends RelationalAddTablePrimaryKey
  implements ExtendedMigrationStep {
  get className() {
    return RelationalAddTablePrimaryKey.name;
  }
  toNode(): ts.NewExpression {
    return ts.createNew(
      ts.createIdentifier(this.className),
      undefined,
      [
        ts.createStringLiteral(this.table),
        ts.createArrayLiteral(
          this.fieldNames.map(fieldName => ts.createStringLiteral(fieldName)),
        ),
      ],
    );
  }

  static parse(args: ts.Expression[]): RelationalAddTablePrimaryKey | null {
    const table = isKind(args[0], ts.SyntaxKind.StringLiteral);
    if (!table) {
      return null;
    }
    const fieldNameArray = isKind(
      args[1],
      ts.SyntaxKind.ArrayLiteralExpression,
    );
    if (!fieldNameArray) {
      return null;
    }
    const fieldNames: string[] = fieldNameArray.elements.map(elm => {
      const fieldName = isKind(elm, ts.SyntaxKind.StringLiteral);
      if (!fieldName) {
        throw new Error('not string');
      }
      return fieldName.text;
    });
    return new RelationalAddTablePrimaryKey(table.text, fieldNames);
  }
}
