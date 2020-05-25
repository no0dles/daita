import { isSqlSchemaTableField } from '../sql-schema-table-field';
import { failNever, isKind } from '@daita/common';
import { isSqlAlias, SqlValue } from '../dml';
import { isSqlSelect } from '../dml/select/sql-select';
import { isSqlFunction } from '../dml/function/sql-function';
import { isSqlRawValue } from '../dml/sql-raw-value';
import { Formatter, FormatterHandler } from './formatter';
import { FormatContext } from './format-context';
import { isSqlField } from '../sql-field';

export interface FormatValue {
  value: SqlValue;
}

export class ValueFormatter implements FormatterHandler {

  handle(param: any, ctx: FormatContext, formatter: Formatter): string | null {
    if (isKind<FormatValue>(param, ['value'])) {
      if (isSqlRawValue(param.value)) {
        return ctx.appendValue(param.value);
      }

      if (isSqlFunction(param.value)) {
        return formatter.format({ function: param.value }, ctx);
      }

      if (isSqlField(param.value)) {
        return formatter.format({ field: param.value }, ctx);
      }

      if (isSqlSelect(param.value)) {
        const sql = `(${formatter.format(param.value, ctx)})`;

        if (isSqlAlias(param.value)) {
          return formatter.format({ alias: param.value.alias, value: sql }, ctx);
        } else {
          return sql;
        }
      }

      if (isSqlSchemaTableField(param.value)) {
        return formatter.format({ field: param.value }, ctx);
      }

      failNever(param.value, 'unknown value');
    }

    return null;
  }
}
