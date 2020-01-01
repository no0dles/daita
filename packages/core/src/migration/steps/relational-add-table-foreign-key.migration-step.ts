import * as ts from 'typescript';
import {RelationalTableSchemaTableFieldType} from '../../schema';
import {BaseMigrationStep} from './base-migration-step';
import {isKind} from '../generation/utils';

export class RelationalAddTableForeignKey implements BaseMigrationStep {
  kind = "add_table_foreign_key";

  constructor(
    public table: string,
    public name: string,
    public fieldNames: string[],
    public foreignTable: string,
    public foreignFieldNames: string[]
  ) {}

  toNode(): ts.NewExpression {
    return ts.createNew(
      ts.createIdentifier(RelationalAddTableForeignKey.name),
      undefined,
      [
        ts.createStringLiteral(this.table),
        ts.createStringLiteral(this.name),
        ts.createArrayLiteral(this.fieldNames.map(fieldName => ts.createStringLiteral(fieldName))),
        ts.createStringLiteral(this.foreignTable),
        ts.createArrayLiteral(this.foreignFieldNames.map(fieldName => ts.createStringLiteral(fieldName))),
      ]
    );
  }

  static parse(args: ts.Expression[]): RelationalAddTableForeignKey | null {
    const table = isKind(args[0], ts.SyntaxKind.StringLiteral);
    if(!table) {
      return null;
    }

    const name = isKind(args[1], ts.SyntaxKind.StringLiteral);
    if(!name) {
      return null;
    }

    const fieldNameArray = isKind(args[2], ts.SyntaxKind.ArrayLiteralExpression);
    if(!fieldNameArray) {
      return null;
    }
    const fieldNames: string[] = fieldNameArray.elements.map(elm => {
      const fieldName = isKind(elm, ts.SyntaxKind.StringLiteral);
      if(!fieldName) {
        throw new Error('not string');
      }
      return fieldName.text;
    });

    const foreignTable = isKind(args[3], ts.SyntaxKind.StringLiteral);
    if(!foreignTable) {
      return null;
    }

    const foreignFieldNameArray = isKind(args[4], ts.SyntaxKind.ArrayLiteralExpression);
    if(!foreignFieldNameArray) {
      return null;
    }
    const foreignFieldNames: string[] = foreignFieldNameArray.elements.map(elm => {
      const fieldName = isKind(elm, ts.SyntaxKind.StringLiteral);
      if(!fieldName) {
        throw new Error('not string');
      }
      return fieldName.text;
    });

    return new RelationalAddTableForeignKey(table.text, name.text, fieldNames, foreignTable.text, foreignFieldNames);
  }
}
