import { isSqlDropTable } from '../ddl/drop-table/drop-table-query';
import { Formatter, FormatterHandler } from './formatter';
import { FormatContext } from './format-context';

export interface DropTableFormatterOptions {
  dropTableKeyword: string; //"DROP TABLE";
  ifExistsKeyword: string; //"IF EXISTS";
}

export class DropTableFormatter implements FormatterHandler {
  constructor(private options: DropTableFormatterOptions) {
  }

  handle(param: any, ctx: FormatContext, formatter: Formatter): string | null {
    if (isSqlDropTable(param)) {
      let sql = this.options.dropTableKeyword;
      if (param.ifExist) {
        sql += ` ${this.options.ifExistsKeyword}`;
      }
      sql += ` ${formatter.format({ table: param.dropTable }, ctx)}`;
      return sql;
    }

    return null;
  }
}
