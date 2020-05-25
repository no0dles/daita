import { SqlTable } from '../sql-table';
import { isKind } from '@daita/common';
import { Formatter, FormatterHandler } from './formatter';
import { FormatContext } from './format-context';

export interface FormatTable {
  table: SqlTable;
}

export class TableFormatter implements FormatterHandler {

  handle(param: any, ctx: FormatContext, formatter: Formatter): string | null {
    if (isKind<FormatTable>(param, ['table'])) {
      if (typeof param.table === 'string') {
        return formatter.format({ escape: param.table }, ctx);
      } else {
        if (param.table.schema) {
          return `${formatter.format({ escape: param.table.schema }, ctx)}.${formatter.format({ escape: param.table.table }, ctx)}`;
        } else {
          return formatter.format({ escape: param.table.table }, ctx);
        }
      }
    }

    return null;
  }
}
