import { Formatter, FormatterHandler } from './formatter';
import { isSqlDelete } from '../dml/delete/sql-delete';
import { FormatContext } from './format-context';

export interface DeleteFormatterOptions {
  deleteKeyword: string; //"DELETE FROM";
}

export class DeleteFormatter implements FormatterHandler {
  constructor(private options: DeleteFormatterOptions) {
  }

  handle(param: any, ctx: FormatContext, formatter: Formatter): string | null {
    if (isSqlDelete(param)) {
      let sql = `${this.options.deleteKeyword} ${formatter.format({ table: param.delete }, ctx)}`;
      if (param.where) {
        sql += formatter.format({ expression: param.where }, ctx);
      }
      return sql;
    }
    return null;
  }
}
