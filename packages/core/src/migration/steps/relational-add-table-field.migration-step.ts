import * as ts from 'typescript';
import {RelationalTableSchemaTableFieldType} from '../../schema';
import {BaseMigrationStep} from './base-migration-step';
import {getBooleanValue, isKind} from '../generation/utils';

export class RelationalAddTableFieldMigrationStep implements BaseMigrationStep {
  kind = "add_table_field";

  constructor(
    public table: string,
    public fieldName: string,
    public type: RelationalTableSchemaTableFieldType,
    public required: boolean = false,
    public defaultValue: any = null
  ) {}

  toNode(): ts.NewExpression {
    return ts.createNew(
      ts.createIdentifier(RelationalAddTableFieldMigrationStep.name),
      undefined,
      [
        ts.createStringLiteral(this.table),
        ts.createStringLiteral(this.fieldName),
        ts.createStringLiteral(this.type),
        this.required ? ts.createTrue() : ts.createFalse(),
        this.defaultValue ? ts.createStringLiteral(this.defaultValue) : ts.createNull(),
      ]
    );
  }

  static parse(args: ts.Expression[]): RelationalAddTableFieldMigrationStep | null {
    const table = isKind(args[0], ts.SyntaxKind.StringLiteral);
    if (!table) {
      return null;
    }

    const fieldName = isKind(args[1], ts.SyntaxKind.StringLiteral);
    if (!fieldName) {
      return null;
    }

    const type = isKind(args[2], ts.SyntaxKind.StringLiteral);
    if (!type) {
      return null;
    }

    if (type.text !== 'string' &&
      type.text !== 'number' &&
      type.text !== 'date' &&
      type.text !== 'boolean' &&
      type.text !== 'boolean[]' &&
      type.text !== 'invalid' &&
      type.text !== 'string[]' &&
      type.text !== 'number[]' &&
      type.text !== 'date[]') {
      return null;
    }

    const required = isKind(args[3], ts.SyntaxKind.BooleanKeyword);
    const defaultValue = isKind(args[4], ts.SyntaxKind.StringLiteral);

    return new RelationalAddTableFieldMigrationStep(table.text, fieldName.text, type.text, required ? getBooleanValue(required) : false, defaultValue ? defaultValue.text : null);
  }
}
