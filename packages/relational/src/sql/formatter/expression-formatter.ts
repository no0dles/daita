import { failNever, isKind } from '@daita/common';
import {
  isSqlAndExpression,
  isSqlCompareExpression,
  isSqlInExpression,
  isSqlOrExpression,
  SqlExpression, SqlInOperand, SqlOperand,
} from '../dml/expression';
import { SqlRawValue, SqlSelect } from '../dml';
import { Formatter, FormatterHandler } from './formatter';
import { FormatContext } from './format-context';

export interface ExpressionFormatterOptions {
  whereKeyword: string;
  andKeyword: string;
  orKeyword: string;
}

export interface FormatExpression {
  expression: SqlExpression;
}

export interface FormatCondition {
  condition: SqlExpression;
}

export class ExpressionFormatter implements FormatterHandler {

  constructor(private options: ExpressionFormatterOptions) {
  }

  formatExpression(expression: SqlExpression | null | undefined, ctx: FormatContext, formatter: Formatter) {
    if (expression) {
      return ` ${this.options.whereKeyword} ${this.formatCondition(expression, ctx, formatter)}`;
    }

    return '';
  }

  formatCondition(expression: SqlExpression, ctx: FormatContext, formatter: Formatter) {
    return this.internalFormatExpression(
      expression,
      false,
      ctx,
      formatter,
    );
  }

  private internalFormatExpression(expression: SqlExpression, wrap: boolean, ctx: FormatContext, formatter: Formatter): string {
    if (isSqlAndExpression(expression)) {
      return `${wrap ? '(' : ''}${expression.and
        .map((exp) => this.internalFormatExpression(exp, true, ctx, formatter))
        .join(` ${this.options.andKeyword} `)}${wrap ? ')' : ''}`;
    }

    if (isSqlOrExpression(expression)) {
      return `${wrap ? '(' : ''}${expression.or
        .map((exp) => this.internalFormatExpression(exp, true, ctx, formatter))
        .join(` ${this.options.orKeyword} `)}${wrap ? ')' : ''}`;
    }

    if (isSqlInExpression(expression)) {
      return `${formatter.format({ value: expression.left }, ctx)} ${this.escapeInOperand(
        expression.operand,
        expression.value,
        ctx,
        formatter,
      )}`;
    }

    if (isSqlCompareExpression(expression)) {
      return `${formatter.format({ value: expression.left }, ctx)} ${this.escapeOperator(
        expression.operand,
      )} ${formatter.format({ value: expression.right }, ctx)}`;
    }

    failNever(expression, 'unknown sql expression');
  }

  escapeOperator(operatorType: SqlOperand): string {
    switch (operatorType) {
      case '!=':
        return '!=';
      case '<':
        return '<';
      case '>':
        return '>';
      case 'like':
        return 'LIKE';
      case '>=':
        return '>=';
      case '<=':
        return '<=';
      case '=':
        return '=';
    }
  }

  escapeInOperand(
    inOperand: SqlInOperand,
    value: SqlRawValue[] | SqlSelect,
    ctx: FormatContext,
    formatter: Formatter,
  ): string {
    if (value instanceof Array) {
      const values = value.map((item) => formatter.format({ value: item }, ctx)).join(', ');
      switch (inOperand) {
        case 'in':
          return `IN (${values})`;
        case 'not in':
          return `NOT IN (${values})`;
      }
    } else {
      switch (inOperand) {
        case 'in':
          return `IN (${formatter.format(value, ctx)})`;
        case 'not in':
          return `NOT IN (${formatter.format(value, ctx)})`;
      }
    }
  }

  handle(param: any, ctx: FormatContext, formatter: Formatter): string | null {
    if (isKind<FormatExpression>(param, ['expression'])) {
      return this.formatExpression(param.expression, ctx, formatter);
    }

    if (isKind<FormatCondition>(param, ['condition'])) {
      return this.formatCondition(param.condition, ctx, formatter);
    }

    return null;
  }
}
